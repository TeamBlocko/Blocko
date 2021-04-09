import Roact, { Component, createBinding, createRef, RoactBinding, RoactBindingFunc } from "@rbxts/roact";
import { Spring, GroupMotor } from "@rbxts/flipper";
import { map } from "shared/utility";

export interface NotificationPropTypes extends iNotification {
	Position: UDim2;
	FrameSize: number;
	MaxWidth: number;
	toggleRemoval: (id: string) => void;
}

const SPRING_SETTINGS = {
	frequency: 1, // 4
	dampingRatio: 1, // 1
};

type Goals = {
	Transparency: number;
	Position: number;
};

export class Notification extends Component<NotificationPropTypes> {
	protected frameRef: Roact.Ref<Frame>;
	protected motor: GroupMotor<Goals>;
	protected binding: RoactBinding<Goals>;
	protected setBinding: RoactBindingFunc<Goals>;

	constructor(props: NotificationPropTypes) {
		super(props);

		this.frameRef = createRef();

		this.motor = new GroupMotor<Goals>({ Transparency: 1, Position: 0 });

		[this.binding, this.setBinding] = createBinding(this.motor.getValue());

		this.motor.onStep(this.setBinding);
	}

	didMount() {
		this.motor.setGoal({ Transparency: new Spring(0, SPRING_SETTINGS) });
	}

	didUpdate() {
		this.motor.setGoal({
			Position: new Spring(1, SPRING_SETTINGS),
			Transparency: this.props.HasBeenRemoved ? new Spring(1, SPRING_SETTINGS) : undefined,
		});
		if (this.props.HasBeenRemoved) this.props.toggleRemoval(this.props.Id);
	}

	render() {
		const frameSize = new UDim2(
			0,
			math.min(this.props.MaxWidth, this.props.FrameSize),
			0,
			50 + math.floor(this.props.FrameSize / this.props.MaxWidth),
		);

		return (
			<frame
				Key={this.props.Id}
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={new Color3()}
				BackgroundTransparency={this.binding.map((value) => map(value.Transparency, 0, 1, 0.5, 1))}
				Position={this.binding.map((value) => {
					const frame = this.frameRef.getValue();
					if (frame) return frame.Position.Lerp(this.props.Position, value.Position);
					return this.props.Position;
				})}
				Size={frameSize}
				Ref={this.frameRef}
			>
				<uicorner />
				<textlabel
					AnchorPoint={new Vector2(1, 0.5)}
					BackgroundTransparency={1}
					Position={new UDim2(1, -20, 0.5, 0)}
					Size={UDim2.fromOffset(
						this.props.FrameSize - 80,
						20 + math.floor((this.props.FrameSize - 80) / (this.props.MaxWidth - 80)),
					)}
					Font={Enum.Font.GothamSemibold}
					Text={this.props.Message}
					RichText={true}
					TextTransparency={this.binding.map((value) => value.Transparency)}
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
					ImageTransparency={this.binding.map((value) => value.Transparency)}
				/>
			</frame>
		);
	}
}
