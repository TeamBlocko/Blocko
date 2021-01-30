import { UserInputService, RunService } from "@rbxts/services";
import Roact, { Component, createRef } from "@rbxts/roact";
import TitleText from "client/components/misc/TitleText";
import GWFrame from "client/components/misc/GWFrame";
import SliderBar from "./SliderBar";
import { map, validateText } from "shared/utility";

class Slider extends Component<SliderPropTypes & Partial<PropTypes>, GWStateTypes<number>> {
	private maxRef: Roact.Ref<Frame>;
	private minRef: Roact.Ref<Frame>;
	private connection: RBXScriptConnection | undefined;

	constructor(props: SliderPropTypes & Partial<PropTypes>) {
		super(props);
		this.maxRef = createRef();
		this.minRef = createRef();
	}

	HandleInput(_: TextButton, input: InputObject) {
		if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			switch (input.UserInputState) {
				case Enum.UserInputState.Begin:
					this.connection = RunService.RenderStepped.Connect(() => {
						const mousePos = UserInputService.GetMouseLocation();
						const minAbsPos = this.minRef.getValue()?.AbsolutePosition.X as number;
						const maxAbsPos = this.maxRef.getValue()?.AbsolutePosition.X as number;
						const xPosition = math.clamp(mousePos.X - 3.5, minAbsPos, maxAbsPos);
						const newValue = map(xPosition, minAbsPos, maxAbsPos, this.props.Min, this.props.Max);
						this.props.OnChange(newValue);
					});
					break;
				case Enum.UserInputState.End:
					this.connection?.Disconnect();
					this.connection = undefined;
					break;
			}
		}
	}

	onTextChange(e: TextBox) {
		if (this.connection !== undefined) return;
		let newValue = tonumber(e.Text);
		if (newValue === undefined) newValue = validateText(e.Text);
		if (newValue === undefined) return;
		this.props.OnChange(newValue);
	}

	render() {
		return (
            <GWFrame SizeOffsetY={70} RefValue={this.props.RefValue}>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<TitleText Text={this.props.Name} PosScaleY={0.225} />
				<SliderBar
					Min={{ Value: this.props.Min, Ref: this.minRef }}
					Max={{ Value: this.props.Max, Ref: this.maxRef }}
					Value={this.props.Default}
					HandleInput={(element, input) => this.HandleInput(element, input)}
					OnTextChange={(e) => this.onTextChange(e)}
				/>
				{this.props[Roact.Children]}
			</GWFrame>
		);
	}

	didMount() {
		print(this.maxRef.getValue()?.AbsolutePosition);
		print(this.minRef.getValue()?.AbsolutePosition);
	}
}

export default Slider;
