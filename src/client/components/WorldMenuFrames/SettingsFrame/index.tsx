import Roact from "@rbxts/roact";
import { ClientFunction } from "@rbxts/net";
import { entries } from "@rbxts/object-utils";
import { shallowEqual } from "shared/utility";
import { updateWorldSettings } from "shared/worldSettingsReducer";
import { retriveWorldSettings } from "client/replicationManager";
import store from "client/store";
import notificationStore from "client/notificationStore";
import Container from "../WorldMenuFramesContainer";
import NavBar from "../NavBar";
import Gap from "client/components/misc/Gap";
import Search from "./Search";
import WorldInfo from "./WorldInfo";
import Lighting from "./Lighting";
import Sound from "./Sound";
import Characters from "./Characters";

const updateWorldSettingsRemote = new ClientFunction("UpdateWorldSettings");

const updateServer = (action: ActionRecievedUpdateWorldSettings) => {
	return updateWorldSettingsRemote.GetInstance().InvokeServer(action)
};

function parseSettings(settings: WorldSettings) {
	return updateWorldSettings(entries(settings).map(([propertyName, value]) => ({ propertyName, value })));
}

function SettingsFrame(props: WorldMenuFrames) {
	return (
		<Container RefValue={props.RefValue}>
			<uicorner />
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} />
			<NavBar
				Text="World Settings"
				OnClick={(e) => {
					const worldSettings = retriveWorldSettings().WorldSettings;
					const currentWorldSettings = store.getState().WorldInfo.WorldSettings;
					if (currentWorldSettings.Name.size() < 6) {
						notificationStore.addNotification({
							Message: "Name must be at least 6 characters long.",
							Time: 5,
						});
						return;
					}
					if (currentWorldSettings.Description.size() < 6) {
						notificationStore.addNotification({
							Message: "Description must be at least 6 characters long.",
							Time: 5,
						});
						return;
					}

					if (shallowEqual(worldSettings, currentWorldSettings)) props.OnClick(e);
					else
						notificationStore.addNotification({
							Id: "ApplyPrompt",
							isApplyPrompt: true,
							OnCancelPrompt: () => {
								print("CANCEL");
								notificationStore.removeNotification("ApplyPrompt");
								store.dispatch(parseSettings(worldSettings));
								props.OnClick(e);
							},
							OnApplyPrompt: () => {
								print("APPLY");
								notificationStore.removeNotification("ApplyPrompt");
								notificationStore.addNotification({
									Id: "Syncing",
									Message: "Syncing World Settings",
								})
								updateServer(parseSettings(currentWorldSettings));
								notificationStore.removeNotification("Syncing")
								notificationStore.addNotification({
									Id: "Syncing",
									Message: "Done Syncing",
									Time: 5,
								})
								props.OnClick(e);
							},
						});
				}}
			/>
			<Gap Length={20} />
			<Search />
			<Gap Length={15} />
			<scrollingframe
				AnchorPoint={new Vector2(0, 1)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Size={UDim2.fromScale(1, 1)}
				CanvasSize={UDim2.fromScale(0, 5)}
				ScrollBarImageTransparency={0.85}
				ScrollBarThickness={3}
			>
				<WorldInfo />
				<Lighting />
				<Sound />
				<Characters />
				<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 8)} />
			</scrollingframe>
		</Container>
	);
}

export default SettingsFrame;
