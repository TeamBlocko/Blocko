import Roact from "@rbxts/roact";
import TitleText from "client/components/misc/TitleText";
import GWFrame from "client/components/misc/GWFrame";
import DropdownButton, {DropdownPropTypes} from "./DropdownButton";

function Dropdown<T extends Item, V extends string>(props: DropdownPropTypes<T, V>) {
	return (
		<GWFrame SizeOffsetY={props.Name.size() < 10 ? 25 : 50} ZIndex={props.ZIndex} LayoutOrder={props.LayoutOrder}>
			<uicorner CornerRadius={new UDim(0, 7)} />
			<TitleText Text={props.Name}  />
			<DropdownButton
				{...props}
			/>
		</GWFrame>
	);
}

export default Dropdown;
