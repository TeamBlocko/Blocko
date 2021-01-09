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
		this.setState((oldState) => {
			this.props.OnChange(!oldState.Value);
			return { Value: !oldState.Value };
		});
	}

	render() {
		return (
			<GWFrame SizeOffsetY={25}>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<TitleText Text={this.props.Name} PosScaleY={0.5} />
				<Border HandleInput={() => this.HandleInput()}>
					<Check Value={this.state.Value} HandleInput={() => this.HandleInput()} />
				</Border>
			</GWFrame>
		);
	}
}

export default CheckBox;
