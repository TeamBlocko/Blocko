import Roact, { Component } from "@rbxts/roact";
import GWFrame from "client/components/misc/GWFrame";
import TitleText from "client/components/misc/TitleText";
import Border from "./Border";
import Check from "./Check";

class CheckBox extends Component<GWPropTypes<boolean>, GWStateTypes<boolean>> {
	constructor(props: GWPropTypes<boolean>) {
		super(props);
		this.setState({
			Value: props.Default,
		});
	}

	HandleInput() {
		this.props.OnChange(!this.props.Default);
	}

	render() {
		return (
			<GWFrame SizeOffsetY={25}>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<TitleText Text={this.props.Name} PosScaleY={0.5} />
				<Border HandleInput={() => this.HandleInput()}>
					<Check Value={this.props.Default} HandleInput={() => this.HandleInput()} />
				</Border>
			</GWFrame>
		);
	}
}

export default CheckBox;
