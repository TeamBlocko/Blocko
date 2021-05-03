import Roact from "@rbxts/roact"
import NavBar from "hub/client/components/NavBar";

export = (target: GuiBase2d | PlayerGui) => {
	const handle = Roact.mount(<NavBar />, target);

	return () => {
		Roact.unmount(handle);
	};
};
