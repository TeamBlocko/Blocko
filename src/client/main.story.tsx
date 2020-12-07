import Roact from "@rbxts/roact";
import MainUI from "./components/MainUI";

export = (target: GuiBase2d | PlayerGui ) => {
	const handle = Roact.mount(<MainUI />, target);

	return () => {
		Roact.unmount(handle);
	};
};
