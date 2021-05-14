import Roact from "@rbxts/roact";
import WorldsMenu from "hub/client/components/WorldsMenu";

export = (target: GuiBase2d) => {
	const handle = Roact.mount(<WorldsMenu />, target);

	return () => {
		Roact.unmount(handle);
	};
};
