import Roact from "@rbxts/roact";
import { deepEquals } from "@rbxts/object-utils";
import Container from "../WorldMenuFramesContainer";
import NavBar from "../NavBar";
import Gap from "common/client/components/misc/Gap";
import Search from "./Search";
import WorldInfo from "./WorldInfo";
import Lighting from "./Lighting";
import Sound from "./Sound";
import Characters from "./Characters";
import { retriveWorldSettings } from "template/client/replicationManager";
import store from "template/client/store";

function SettingsFrame(props: WorldMenuFrames) {
	return (
		<Container RefValue={props.RefValue} Size={UDim2.fromScale(0.9, 1)}>
			<uicorner />
			<NavBar
				Text="World Settings"
				OnClick={(e) => {
					const worldSettings = retriveWorldSettings().Settings;
					const currentWorldSettings = store.getState().World.Settings;
					if (deepEquals(worldSettings, currentWorldSettings)) props.OnClick(e);
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
