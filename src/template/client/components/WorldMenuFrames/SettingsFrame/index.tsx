import Roact from "@rbxts/roact";
import { Client } from "@rbxts/net";
import { entries, deepEquals } from "@rbxts/object-utils";
import { ActionRecievedUpdateWorldSettings, updateWorldSettings } from "template/shared/worldSettingsReducer";
import { retriveWorldSettings } from "template/client/replicationManager";
import store from "template/client/store";
import notificationStore from "common/client/notificationStore";
import Container from "../WorldMenuFramesContainer";
import NavBar from "../NavBar";
import Gap from "common/client/components/misc/Gap";
import Search from "./Search";
import WorldInfo from "./WorldInfo";
import Lighting from "./Lighting";
import Sound from "./Sound";
import Characters from "./Characters";

const updateWorldSettingsRemote = new Client.Function<[ActionRecievedUpdateWorldSettings]>("UpdateWorldSettings");

const updateServer = (action: ActionRecievedUpdateWorldSettings) => {
	return updateWorldSettingsRemote.CallServer(action);
};

function parseSettings(settings: WorldSettings) {
	return updateWorldSettings(entries(settings).map(([propertyName, value]) => ({ propertyName, value })));
}

function SettingsFrame(props: WorldMenuFrames) {
	return (
		<Container RefValue={props.RefValue} Size={UDim2.fromScale(0.9, 1)}>
			<uicorner />
			<NavBar
				Text="World Settings"
				OnClick={(e) => {
					const worldSettings = retriveWorldSettings().Settings;
					const currentWorldSettings = store.getState().World.Settings;
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

					if (deepEquals(worldSettings, currentWorldSettings)) props.OnClick(e);
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
								});
								updateServer(parseSettings(currentWorldSettings));
								notificationStore.removeNotification("Syncing");
								notificationStore.addNotification({
									Id: "Syncing",
									Message: "Done Syncing",
									Time: 5,
								});
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
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Padding={new UDim(0, 30)}
					Ref={(e) => {
						if (!e) return;
						e.AncestryChanged.Connect(() => {
							const parent = e.Parent as ScrollingFrame;
							const contentSize = e.AbsoluteContentSize;
							parent.CanvasSize = UDim2.fromOffset(
								0,
								contentSize.Y + 30 * (parent.GetChildren().size() - 1),
							);
						});
					}}
				/>
			</scrollingframe>
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} />
		</Container>
	);
}

export default SettingsFrame;
