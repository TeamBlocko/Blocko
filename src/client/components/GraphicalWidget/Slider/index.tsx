import { UserInputService, RunService } from "@rbxts/services";
import Roact, { Component, createRef } from "@rbxts/roact";
import TitleText from "client/components/TitleText";
import GWContainer from "client/components/GWContainer";
import SliderBar from "./SliderBar";
import { map } from "shared/module";

class Slider<T extends number> extends Component<SliderPropTypes<T>, GWStateTypes<T>> {
	maxRef: Roact.Ref<Frame>;
	minRef: Roact.Ref<Frame>;
	connection: RBXScriptConnection | undefined;

	constructor(props: SliderPropTypes<T>) {
		super(props);
		this.maxRef = createRef();
		this.minRef = createRef();
		this.setState({
			Value: props.Default,
		});
	}

	HandleInput(_: TextButton, input: InputObject) {
		if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			switch (input.UserInputState) {
				case Enum.UserInputState.Begin:
					this.connection = RunService.RenderStepped.Connect(() => {
						const mousePos = UserInputService.GetMouseLocation();
						const minAbsPos = this.minRef.getValue()?.AbsolutePosition.X as number;
						const maxAbsPos = this.maxRef.getValue()?.AbsolutePosition.X as number;
						const xPosition = math.clamp(mousePos.X - 10, minAbsPos, maxAbsPos);
						const newValue = map(xPosition, minAbsPos, maxAbsPos, this.props.Min, this.props.Max);
						this.props.OnChange(newValue);
						this.setState(() => {
							return { Value: newValue };
						});
					});
					break;
				case Enum.UserInputState.End:
					this.connection?.Disconnect();
					break;
			}
		}
	}

	render() {
		return (
			<GWContainer Name={this.props.Name} LayoutOrder={this.props.LayoutOrder} SizeOffsetY={55}>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<TitleText Text="Transparency" PosScaleY={0.225} />
				<SliderBar
					Min={{ Value: this.props.Min, Ref: this.minRef }}
					Max={{ Value: this.props.Max, Ref: this.maxRef }}
					Value={this.state.Value}
					HandleInput={(element, input) => this.HandleInput(element, input)}
				/>
			</GWContainer>
		);
	}

	didMount() {
		print(this.maxRef.getValue()?.AbsolutePosition);
		print(this.minRef.getValue()?.AbsolutePosition);
	}
}

export default Slider;
