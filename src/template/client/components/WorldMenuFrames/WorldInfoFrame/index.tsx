import Roact from "@rbxts/roact";
import Container from "../WorldMenuFramesContainer";
import Thumbnail from "template/client/components/misc/Thumbnail";
import ElementSperator from "template/client/components/misc/ElementSperator";
import { Title, Description } from "./WorldInfo";
import InfoFrame from "./InfoFrame";
import NavBar from "../NavBar";

function WorldInfoFrame(props: WorldMenuFrames) {
	return (
		<Container RefValue={props.RefValue}>
			<uicorner />
			<NavBar Text="World Info" OnClick={(e) => props.OnClick(e)} />
			<frame
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
				Position={new UDim2(0.5, 0, 0, 245)}
				Size={new UDim2(0, 275, 0.025, 175)}
			>
				<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 6)} />
				<Title />
				<ElementSperator />
				<Description />
			</frame>
			<Thumbnail Position={new UDim2(0.5, 0, 0, 45)} />
			<InfoFrame />
		</Container>
	);
}

export default WorldInfoFrame;
