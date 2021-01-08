import Roact, { Component } from "@rbxts/roact";
import GWFrame from "client/components/misc/GWFrame";
import TitleText from "client/components/misc/TitleText";
import CheckBoxElement from "./CheckBoxElement";

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
				<CheckBoxElement ScaleType={Enum.ScaleType.Fit} HandleInput={() => this.HandleInput()}>
					<CheckBoxElement Value={this.state.Value} Fill={true} HandleInput={() => this.HandleInput()} />
				</CheckBoxElement>
			</GWFrame>
		);
	}
}

export default CheckBox;
