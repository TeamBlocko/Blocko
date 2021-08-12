import Roact from "@rbxts/roact";
import WorldCreationFrame from "hub/client/components/WorldsMenu/PopupFrames/WorldCreationFrame";

export = (target: GuiBase2d) => {
	const [binding, setBinding] = Roact.createBinding(1);
	const handle = Roact.mount(<WorldCreationFrame Position={binding} Visible={true} />, target);

	return () => {
		Roact.unmount(handle);
	};
};
