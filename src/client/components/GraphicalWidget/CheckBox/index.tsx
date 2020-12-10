import Roact, { Component } from "@rbxts/roact";
import GWContainer from "client/components/GWContainer";
import TitleText from "client/components/TitleText";
import CheckBoxElement from "./CheckBoxElement";

class CheckBox<T extends boolean> extends Component<GWPropTypes<T>, GWStateTypes<T>> {
	constructor(props: GWPropTypes<T>) {
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
			<GWContainer Name={this.props.Name} SizeOffsetY={25} LayoutOrder={4}>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<TitleText Text={this.props.Name} PosScaleY={0.5} />
				<CheckBoxElement ScaleType={Enum.ScaleType.Fit} HandleInput={() => this.HandleInput()}>
					<CheckBoxElement Value={this.state.Value} Fill={true} HandleInput={() => this.HandleInput()} />
				</CheckBoxElement>
			</GWContainer>
		);
	}
}

export default CheckBox;
