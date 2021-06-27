import Roact from "@rbxts/roact";
import Flipper from "@rbxts/flipper";

interface Check {
	Value: boolean;
	HandleInput: () => void;
}

class CheckBoxElement extends Roact.Component<Check> {
	motor: Flipper.SingleMotor;
	binding: Roact.RoactBinding<number>;
	setBinding: Roact.RoactBindingFunc<number>;

	constructor(props: Check) {
		super(props);
		this.motor = new Flipper.SingleMotor(props.Value ? 0 : 1);

		[this.binding, this.setBinding] = Roact.createBinding(this.motor.getValue());

		this.motor.onStep(this.setBinding);
	}

	didUpdate() {
		this.motor.setGoal(new Flipper.Spring(this.props.Value ? 0 : 1))
	}

	render() {
		return (
			<imagebutton
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(20, 20)}
				Event={{
					Activated: () => {
						this.motor.setGoal(new Flipper.Spring(!this.props.Value ? 0 : 1));
						this.props.HandleInput();
					},
				}}
				Position={UDim2.fromScale(0.5, 0.5)}
				Image="rbxassetid://3926311105"
				ImageTransparency={this.binding}
				ImageRectOffset={new Vector2(4, 836)}
				ImageRectSize={new Vector2(48, 48)}
			/>
		);
	}
}

export default CheckBoxElement;
