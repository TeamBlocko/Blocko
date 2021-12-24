import Roact from "@rbxts/roact";
import { NumberInput } from "../components/GraphicalWidget/NumberInput";

export = (target: GuiBase2d) => {
	const handle = Roact.mount(
		<NumberInput
			Default={1}
			Name="Input"
			ValidationHandler={(input) => {
				const [match] = input.match("%d+");
				return match ? tostring(match) : undefined;
			}}
			OnChange={(value) => print(`Jello ${value}!`)}
		/>,
		target,
	);

	return () => {
		Roact.unmount(handle);
	};
};
