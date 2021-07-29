import Roact from "@rbxts/roact";
import Flipper from "@rbxts/flipper";

interface NavButtonPropTypes {
	Image: string;
	ImageRectOffset: Vector2;
	ImageRectSize: Vector2;
	Selected?: boolean;
	OnClick: () => void;
}

type Goal = { hover: number; selected: number };

class NavButton extends Roact.Component<NavButtonPropTypes> {
	binding: Roact.RoactBinding<Goal>;
	setBinding: Roact.RoactBindingFunc<Goal>;
	motor: Flipper.GroupMotor<Goal>;

	constructor(props: NavButtonPropTypes) {
		super(props);

		[this.binding, this.setBinding] = Roact.createBinding({ hover: 0, selected: this.props.Selected ? 1 : 0 });

		this.motor = new Flipper.GroupMotor(this.binding.getValue());
		this.motor.onStep(this.setBinding);
	}

	didUpdate() {
		this.motor.setGoal({ selected: new Flipper.Spring(this.props.Selected ? 1 : 0) });
	}

	render() {
		return (
			<imagebutton
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={this.props.Selected ? 0.95 : 1}
				Size={UDim2.fromScale(0.4, 0.4)}
				AutoButtonColor={false}
				BorderColor3={Color3.fromRGB(27, 42, 53)}
				Event={{
					Activated: () => this.props.OnClick(),
					MouseEnter: () => this.motor.setGoal({ hover: new Flipper.Spring(1) }),
					MouseLeave: () => this.motor.setGoal({ hover: new Flipper.Spring(0) }),
				}}
			>
				<uiaspectratioconstraint />
				<uicorner CornerRadius={this.binding.map((value) => new UDim(value.selected * 0.35, 0))} />
				<imagelabel
					Active={true}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					BorderColor3={Color3.fromRGB(27, 42, 53)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Selectable={true}
					Size={UDim2.fromScale(0.6, 0.6)}
					Image={this.props.Image}
					ImageRectOffset={this.props.ImageRectOffset}
					ImageRectSize={this.props.ImageRectSize}
					ImageTransparency={this.binding.map((value) => (1 - value.selected) * 0.65)}
					ImageColor3={
						this.props.Selected
							? Color3.fromRGB(69, 165, 255)
							: this.binding.map((value) =>
									new Color3(1, 1, 1).Lerp(Color3.fromRGB(158, 181, 255), value.hover),
							  )
					}
				></imagelabel>
			</imagebutton>
		);
	}
}

export default NavButton;
