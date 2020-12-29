import Roact from "@rbxts/roact";
import { DragFrame, DragDropProvider } from "@rbxts/roact-dnd";
import GWContainer from "./GWContainer";
import DragDropContext from "client/dragDropContext";

function BuildUI() {
	return (
		<DragDropProvider context={DragDropContext}>
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
			>
				<uicorner CornerRadius={new UDim(0, 10)} />
				<GWContainer />
			</DragFrame>
		</DragDropProvider>
	);
}

export default BuildUI;
