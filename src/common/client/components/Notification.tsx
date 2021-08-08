import Roact, { Component, createBinding, createRef } from "@rbxts/roact";
import { Spring, SingleMotor } from "@rbxts/flipper";
import { map } from "common/shared/utility";

export interface NotificationPropTypes extends iNotification {
	FrameSize: number;
	MaxWidth: number;
	toggleRemoval: (id: string) => void;
}

const SPRING_SETTINGS = {
	frequency: 1, // 4
	dampingRatio: 1, // 1
};

export class Notification extends Component<NotificationPropTypes> {
	protected frameRef: Roact.Ref<Frame>;
	protected motor: SingleMotor;
	protected binding: Roact.Binding<number>;
	protected setBinding: Roact.BindingFunction<number>;

	constructor(props: NotificationPropTypes) {
		super(props);

		this.frameRef = createRef();

		this.motor = new SingleMotor(1);

		[this.binding, this.setBinding] = createBinding(this.motor.getValue());

		this.motor.onStep(this.setBinding);
	}

	didMount() {
		this.motor.setGoal(new Spring(0, SPRING_SETTINGS));
	}

	didUpdate() {
		if (!this.props.HasBeenRemoved) return;
		this.motor.setGoal(new Spring(1, SPRING_SETTINGS));
		this.props.toggleRemoval(this.props.Id);
	}

	render() {
		return (
			<frame
				Key={this.props.Id}
				BackgroundColor3={Color3.fromRGB(30, 30, 30)}
				BackgroundTransparency={this.binding.map((value) => map(value, 0, 1, 0.1, 1))}
				AutomaticSize={Enum.AutomaticSize.XY}
				Ref={this.frameRef}
			>
				<imagelabel
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0, 0.5)}
					Size={UDim2.fromOffset(35, 35)}
					Image={this.props.Icon}
				/>
				<frame AutomaticSize={Enum.AutomaticSize.XY} BackgroundTransparency={1}>
					<textlabel
						AutomaticSize={Enum.AutomaticSize.XY}
						BackgroundTransparency={1}
						Font={Enum.Font.GothamBold}
						Text={this.props.Title}
						RichText={true}
						TextColor3={new Color3(1, 1, 1)}
						TextSize={14}
						TextTransparency={this.binding.map((value) => map(value, 0, 1, 0.25, 1))}
						TextWrap={true}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
					<textbox
						AutomaticSize={Enum.AutomaticSize.XY}
						BackgroundTransparency={1}
						Font={Enum.Font.GothamSemibold}
						RichText={true}
						Text={this.props.Message}
						TextColor3={new Color3(1, 1, 1)}
						TextSize={14}
						TextEditable={false}
						ClearTextOnFocus={false}
						TextTransparency={this.binding.map((value) => map(value, 0, 1, 0.25, 1))}
						TextWrap={true}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
					<uilistlayout VerticalAlignment={Enum.VerticalAlignment.Center} Padding={new UDim(0, 5)} />
					<uisizeconstraint MaxSize={new Vector2(350, math.huge)} />
				</frame>
				<uicorner CornerRadius={new UDim(0, 10)} />
				<uipadding
					PaddingBottom={new UDim(0, 16)}
					PaddingLeft={new UDim(0, 18)}
					PaddingRight={new UDim(0, 18)}
					PaddingTop={new UDim(0, 16)}
				/>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, 18)}
				/>
			</frame>
		);
	}
}
