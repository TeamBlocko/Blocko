import Roact from "@rbxts/roact";
import Container from "../WorldMenuFramesContainer";
import NavBar from "../NavBar";
import Gap from "client/components/misc/Gap";
import Search from "./Search";
import WorldInfo from "./WorldInfo";
import Lighting from "./Lighting";
import Sound from "./Sound";
import Characters from "./Characters";

function SettingsFrame(props: WorldMenuFrames) {
	return (
		<Container RefValue={props.RefValue}>
			<uicorner />
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} />
			<NavBar Text="World Settings" OnClick={(e) => props.OnClick(e)} />
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
