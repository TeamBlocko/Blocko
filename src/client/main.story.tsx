import Roact from "@rbxts/roact";
import BuildUI from "./components/BuildUI";

export = (target: GuiBase2d | PlayerGui) => {
	const handle = Roact.mount(<BuildUI />, target);

	return () => {
		Roact.unmount(handle);
	};
};
