import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { DragFrame, DragDropProvider } from "@rbxts/roact-dnd";
import GWContainer from "./GWContainer";

function BuildUI(props: PlacementSettings) {
	return (
		<DragDropProvider>
			<DragFrame
				DropId="BuildUI"
				DropResetsPosition={false}
				TargetData=""
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(35, 35, 35)}
				BackgroundTransparency={0}
				Position={UDim2.fromScale(0.2, 0.5)}
				Size={UDim2.fromOffset(225, 300)}
				DragConstraint="Viewport"
				Visible={props.BuildMode === "Place"}
			>
				<uicorner CornerRadius={new UDim(0, 10)} />
				<GWContainer />
			</DragFrame>
		</DragDropProvider>
	);
}

export default connect((state: IState) => state.PlacementSettings)(BuildUI);
