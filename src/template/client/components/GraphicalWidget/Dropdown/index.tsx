import Roact from "@rbxts/roact";
import TitleText from "template/client/components/misc/TitleText";
import GWFrame from "template/client/components/misc/GWFrame";
import DropdownButton, { DropdownPropTypes } from "./DropdownButton";

interface StyledDropdownPropTypes<T, V> extends DropdownPropTypes<T, V> {
	BackgroundTransparency?: number;
	ResizeForDropdown?: boolean;
}

class Dropdown<T extends Item, V extends string> extends Roact.Component<StyledDropdownPropTypes<T, V>> {
	
	defaultSize: number;
	binding: Roact.RoactBinding<number>;
	setBinding: Roact.RoactBindingFunc<number>;

	constructor(props: StyledDropdownPropTypes<T, V>) {
		super(props);

		this.defaultSize = props.Name.size() < 9 ? 25 : 50;
		[this.binding, this.setBinding] = Roact.createBinding(this.defaultSize);
	}

	render() {
		return (
			<GWFrame
				SizeOffsetY={this.binding}
				ZIndex={this.props.ZIndex}
				LayoutOrder={this.props.LayoutOrder}
				BackgroundTransparency={this.props.BackgroundTransparency}
			>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<TitleText Text={this.props.Name} />
				<DropdownButton {...this.props} OnExtend={isExtended => {
					if (this.props.ResizeForDropdown) {
						this.setBinding(isExtended ? this.props.Items.size() * 27 : this.defaultSize)
					}
				}} />
			</GWFrame>
		);
	}
}

export default Dropdown;
