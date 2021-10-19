import { UserInputService, RunService } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { SingleMotor, Spring } from "@rbxts/flipper";
import TitleText from "template/client/components/misc/TitleText";
import GWFrame from "template/client/components/misc/GWFrame";
import SliderBar from "./SliderBar";
import { map, validateText } from "common/shared/utility";

class Slider extends Roact.Component<SliderPropTypes & Roact.PropsWithChildren, GWStateTypes<number>> {
	private frameRef: Roact.Ref<Frame>;
	private maxRef: Roact.Ref<Frame>;
	private minRef: Roact.Ref<Frame>;
	private connection: RBXScriptConnection | undefined;

	mouseEnterConnection: RBXScriptConnection | undefined;
	mouseLeaveConnection: RBXScriptConnection | undefined;

	motor: SingleMotor;
	binding: Roact.Binding<number>;
	setBinding: Roact.BindingFunction<number>;

	constructor(props: SliderPropTypes & Roact.PropsWithChildren) {
		super(props);
		this.frameRef = props.RefValue ?? Roact.createRef();
		this.maxRef = Roact.createRef();
		this.minRef = Roact.createRef();

		this.motor = new SingleMotor(1);
		[this.binding, this.setBinding] = Roact.createBinding(this.motor.getValue());
		this.motor.onStep(this.setBinding);
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
			<GWFrame
				SizeOffsetY={this.props.SizeYOffset ?? 70}
				RefValue={this.frameRef}
				BackgroundTransparency={this.props.BackgroundTransparency}
				LayoutOrder={this.props.LayoutOrder}
			>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<TitleText Text={this.props.Name} />
				<SliderBar
					Binding={this.binding}
					Min={{ Value: this.props.Min, Ref: this.minRef }}
					Max={{ Value: this.props.Max, Ref: this.maxRef }}
					Value={this.props.Default}
					DecimalPlace={this.props.DecimalPlace ?? 0}
					HandleInput={(element, input) => this.HandleInput(element, input)}
					OnTextChange={(e) => this.onTextChange(e)}
				/>
				{this.props[Roact.Children]}
			</GWFrame>
		);
	}

	setUpConnections() {
		const frame = this.frameRef?.getValue();
		if (frame === undefined) return;

		this.mouseEnterConnection?.Disconnect();
		this.mouseLeaveConnection?.Disconnect();
		this.mouseEnterConnection = frame.MouseEnter.Connect(() => this.motor.setGoal(new Spring(0)));
		this.mouseLeaveConnection = frame.MouseLeave.Connect(() => this.motor.setGoal(new Spring(1)));
	}

	didMount() {
		this.setUpConnections();
	}

	didUpdate() {
		this.setUpConnections();
	}
}

export default Slider;
