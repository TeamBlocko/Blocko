import Roact from "@rbxts/roact";
import Flipper from "@rbxts/flipper";

interface BottomFramePropTypes {
	Button1Text: string;
	Button2Text: string;
	Button1Click: () => void;
	Button2Click: () => void;
	Button2Disabled?: boolean;
}

interface ButtonPropTypes {
	Text: string;
	OnClick: () => void;
	BackgroundColor: Color3;
	ButtonDisabled?: boolean;
}

class Button extends Roact.Component<ButtonPropTypes> {
	binding: Roact.Binding<number>;
	setBinding: Roact.BindingFunction<number>;
	motor: Flipper.SingleMotor;

	constructor(props: ButtonPropTypes) {
		super(props);

		[this.binding, this.setBinding] = Roact.createBinding(this.props.ButtonDisabled ? 1 : 0);

		this.motor = new Flipper.SingleMotor(this.binding.getValue());

		this.motor.onStep(this.setBinding);
	}

	didUpdate() {
		this.motor.setGoal(this.props.ButtonDisabled ? new Flipper.Instant(1) : new Flipper.Spring(0));
	}

	render() {
		return (
			<textbutton
				BackgroundColor3={this.binding.map((value) =>
					this.props.BackgroundColor.Lerp(Color3.fromRGB(40, 40, 40), value),
				)}
				Size={UDim2.fromScale(0.25, 1)}
				Text={""}
				Event={{
					Activated: () => this.props.OnClick(),
				}}
			>
				<uicorner CornerRadius={new UDim(0.15, 0)} />
				<textlabel
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.9, 0.475)}
					Text={this.props.Text}
					Font={Enum.Font.GothamBold}
					TextColor3={new Color3(1, 1, 1)}
					TextScaled={true}
					TextSize={14}
					TextWrapped={true}
				/>
			</textbutton>
		);
	}
}

function BottomFrame(props: BottomFramePropTypes) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 1)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 1)}
			Size={UDim2.fromScale(1, 0.175)}
		>
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.9, 0.5)}
			>
				<Button
					Text={props.Button1Text}
					OnClick={props.Button1Click}
					BackgroundColor={Color3.fromRGB(40, 40, 40)}
				/>
				<Button
					Text={props.Button2Text}
					OnClick={props.Button2Click}
					ButtonDisabled={props.Button2Disabled}
					BackgroundColor={Color3.fromRGB(62, 148, 229)}
				/>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					Padding={new UDim(0.025, 0)}
				/>
			</frame>
		</frame>
	);
}

export default BottomFrame;
