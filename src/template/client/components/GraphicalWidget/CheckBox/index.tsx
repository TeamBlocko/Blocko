import Roact, { Component } from "@rbxts/roact";
import GWFrame from "template/client/components/misc/GWFrame";
import TitleText from "template/client/components/misc/TitleText";
import Border from "./Border";
import Check from "./Check";

class CheckBox extends Component<GWPropTypes<boolean> & { SizeYOffset?: number }> {
	constructor(props: GWPropTypes<boolean> & { SizeYOffset?: number }) {
		super(props);
	}

	HandleInput() {
		this.props.OnChange(!this.props.Default);
	}

	render() {
		return (
			<GWFrame SizeOffsetY={this.props.SizeYOffset ?? 30} LayoutOrder={this.props.LayoutOrder}>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<TitleText
					Text={this.props.Name}
					Position={UDim2.fromScale(0, 0.5)}
					AnchorPoint={new Vector2(0, 0.5)}
				/>
				<Border HandleInput={() => this.HandleInput()}>
					<Check Value={this.props.Default} HandleInput={() => this.HandleInput()} />
				</Border>
			</GWFrame>
		);
	}
}

export default CheckBox;
