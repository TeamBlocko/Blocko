import Roact from "@rbxts/roact";
import { ClientEvent } from "@rbxts/net";
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

const updateWorldSettingsRemote = new ClientEvent("UpdateWorldSettings");

const updateServer = (action: ActionRecievedUpdateWorldSettings) => updateWorldSettingsRemote.SendToServer(action);

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
					const worldSettings = retriveWorldSettings();
					const currentWorldSettings = store.getState().WorldSettings;
					print("OLD", worldSettings);
					print("NEW", currentWorldSettings);
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
								updateServer(parseSettings(currentWorldSettings));
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
