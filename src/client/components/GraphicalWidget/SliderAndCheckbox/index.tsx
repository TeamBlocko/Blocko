import Roact, { Component, createRef } from "@rbxts/roact";
import Slider from "../Slider";
import Border from "../CheckBox/Border";
import Check from "../CheckBox/Check";

interface SliderAndCheckBoxPropTypes {
	Name: string;
	SliderSettings: Omit<SliderPropTypes<number>, "Name">;
	CheckBoxSettings: Omit<GWPropTypes<boolean>, "Name">;
}

class SliderAndCheckBox extends Component<SliderAndCheckBoxPropTypes, GWStateTypes<boolean>> {
	sliderFrameRef: Roact.Ref<Frame>;

	constructor(props: SliderAndCheckBoxPropTypes) {
		super(props);
		this.sliderFrameRef = createRef();
		this.setState({
			Value: props.CheckBoxSettings.Default,
		});
	}

	HandleInput() {
		this.setState((oldState) => {
			this.props.CheckBoxSettings.OnChange(!oldState.Value);
			return { Value: !oldState.Value };
		});
	}

	render() {
		return (
			<Slider Name={this.props.Name} {...this.props.SliderSettings} RefValue={this.sliderFrameRef}>
				<Border HandleInput={() => this.HandleInput()} Position={UDim2.fromScale(0.925, 0.225)}>
					<Check Value={this.state.Value} HandleInput={() => this.HandleInput()} />
				</Border>
			</Slider>
		);
	}

	didMount() {
		const sliderFrame = this.sliderFrameRef.getValue();
		if (sliderFrame === undefined) return;
		sliderFrame.BackgroundTransparency = this.state.Value ? 0.95 : 0.96;
	}

	didUpdate() {
		const sliderFrame = this.sliderFrameRef.getValue();
		if (sliderFrame === undefined) return;
		sliderFrame.BackgroundTransparency = this.state.Value ? 0.95 : 0.96;
	}
}

export default SliderAndCheckBox;
