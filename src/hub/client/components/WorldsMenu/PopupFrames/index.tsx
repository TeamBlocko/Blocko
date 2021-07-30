import Roact from "@rbxts/roact";
import WorldCreationFrame from "./WorldCreationFrame";
import { popupFrameContext } from "../popupFramesContext";

function PopupFrames() {
	return (
		<popupFrameContext.Consumer
			render={(value) => {
				return (
					<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)} ZIndex={3}>
						{value.OpenPopup?.name === "Create" ? <WorldCreationFrame /> : undefined}
					</frame>
				);
			}}
		/>
	);
}

export default PopupFrames;
