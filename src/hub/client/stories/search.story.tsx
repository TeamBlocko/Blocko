import Roact from "@rbxts/roact";
import Search from "hub/client/components/WorldsMenu/Search";

export = (target: GuiBase2d) => {
	const handle = Roact.mount(<Search />, target);

	return () => {
		Roact.unmount(handle);
	};
};
