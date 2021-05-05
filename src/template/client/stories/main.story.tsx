import Roact from "@rbxts/roact";
import BuildUI from "template/client/components/BuildUI";

export = (target: GuiBase2d) => {
	const handle = Roact.mount(<BuildUI />, target);

	return () => {
		Roact.unmount(handle);
	};
};
