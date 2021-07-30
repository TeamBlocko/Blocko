import Roact from "@rbxts/roact";
import WorldCreationFrame from "hub/client/components/WorldsMenu/PopupFrames/WorldCreationFrame";

export = (target: GuiBase2d) => {
	const handle = Roact.mount(<WorldCreationFrame />, target);

	return () => {
		Roact.unmount(handle);
	};
};
