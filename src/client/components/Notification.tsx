import Roact, { Component, createBinding, createRef, RoactBinding, RoactBindingFunc } from "@rbxts/roact";
import { SingleMotor, Spring } from "@rbxts/flipper";
import { map } from "shared/utility";

const SPRING_SETTINGS = {
	frequency: 1, // 4
	dampingRatio: 1, // 1
};

export class Notification extends Component<NotificationPropTypes> {

	protected frameRef: Roact.Ref<Frame>;
	protected motor: SingleMotor;
	protected binding: RoactBinding<number>;
	protected setBinding: RoactBindingFunc<number>;

	protected motor2: SingleMotor;
	protected binding2: RoactBinding<number>;
	protected setBinding2: RoactBindingFunc<number>;


	constructor(props: NotificationPropTypes) {
		super(props);

		this.frameRef = createRef();
		this.motor = new SingleMotor(1);
		[this.binding, this.setBinding] = createBinding(this.motor.getValue());

		this.motor.onStep(this.setBinding);

		this.motor2 = new SingleMotor(0);
		[this.binding2, this.setBinding2] = createBinding(this.motor2.getValue());

		this.motor2.onStep(this.setBinding2);
	}

	removeNotification() {
		this.motor.setGoal(new Spring(1, SPRING_SETTINGS))
		this.motor.onComplete(() => this.props.toggleRemoval(this.props.Id))
	}

	didMount() {
		this.motor.setGoal(new Spring(0, SPRING_SETTINGS))
	}

	didUpdate() {
		if (this.props.HasBeenRemoved)
			this.removeNotification();
		this.motor2.setGoal(new Spring(1, SPRING_SETTINGS));
	}

	render() {
		const frameSize = new UDim2(
			0,
			math.min(this.props.MaxWidth, this.props.FrameSize),
			0,
			50 + math.floor(this.props.FrameSize / this.props.MaxWidth)
		)
		
		return (
			<frame
				Key={this.props.Id}
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={new Color3()}
				BackgroundTransparency={this.binding.map(value => map(value, 0, 1, 0.5, 1))}
				Position={this.binding2.map(value => {
					const frame = this.frameRef.getValue();
					if (frame)
						return frame.Position.Lerp(this.props.Position, value)
					return this.props.Position
				})}
				Size={frameSize}
				Ref={this.frameRef}
			>
				<uicorner />
				<textlabel
					AnchorPoint={new Vector2(1, 0.5)}
					BackgroundTransparency={1}
					Position={new UDim2(1, -20, 0.5, 0)}
					Size={UDim2.fromOffset(this.props.FrameSize - 80, 20 + math.floor((this.props.FrameSize - 80) / (this.props.MaxWidth - 80)))}
					Font={Enum.Font.GothamSemibold}
					Text={this.props.Message}
					RichText={true}
					TextTransparency={this.binding.map(value => value)}
					TextColor3={new Color3(1, 1, 1)}
					TextSize={18}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Right}
				/>
				<imagebutton
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundTransparency={1}
					Position={new UDim2(0, 20, 0.5, 0)}
					Size={UDim2.fromOffset(20, 20)}
					Image={this.props.Icon}
					ScaleType={Enum.ScaleType.Crop}
					ImageTransparency={this.binding.map(value => value)}
				/>
			</frame>
		)
	}
}