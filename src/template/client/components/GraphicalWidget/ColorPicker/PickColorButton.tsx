import Roact from "@rbxts/roact";
import { SingleMotor, Spring } from "@rbxts/flipper";
import { UserInputService, Workspace } from "@rbxts/services";
import { IState } from "template/shared/Types";
import { connect } from "@rbxts/roact-rodux";
import { updateColorPickerActivated } from "template/client/rodux/updateColorPicker";

const camera = Workspace.CurrentCamera;

interface PickColorButtonPropTypes {
	UpdateColorPickerActivated(activated?: string | undefined): void;
	Id: string;
}

interface PickColorButtonRoduxTypes {
	UpdateColor: (value: Color3) => void;
	Activated: boolean;
}

class PickColorButton extends Roact.Component<PickColorButtonPropTypes & PickColorButtonRoduxTypes> {
	motor: SingleMotor;
	binding: Roact.RoactBinding<number>;
	setBinding: Roact.RoactBindingFunc<number>;

	constructor(props: PickColorButtonPropTypes & PickColorButtonRoduxTypes) {
		super(props);

		this.motor = new SingleMotor(0);
		[this.binding, this.setBinding] = Roact.createBinding(this.motor.getValue());

		this.motor.onStep(this.setBinding);
	}

	render() {
		return (
			<imagebutton
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.1, 0.9)}
				Size={UDim2.fromOffset(20, 20)}
				ImageColor3={this.binding.map((value) => new Color3(1, 1, 1).Lerp(Color3.fromRGB(89, 161, 255), value))}
				Image="rbxassetid://3926305904"
				ImageRectOffset={new Vector2(804, 924)}
				ImageRectSize={new Vector2(36, 36)}
				Event={{
					Activated: () => {
						const newValue = !this.props.Activated ? this.props.Id : undefined;
						this.props.UpdateColorPickerActivated(newValue);
						this.motor.setGoal(new Spring(newValue === this.props.Id ? 1 : 0));
					},
				}}
			/>
		);
	}

	raycastMouse() {
		if (camera === undefined) return;
		const raycastParams = new RaycastParams();
		raycastParams.FilterType = Enum.RaycastFilterType.Blacklist;
		const ghostPart = Workspace.FindFirstChild("GhostPart");
		if (ghostPart) {
			raycastParams.FilterDescendantsInstances = [ghostPart];
		}

		const mousePos = UserInputService.GetMouseLocation();
		const mouseUnitRay = camera.ScreenPointToRay(mousePos.X, mousePos.Y - 36);
		return Workspace.Raycast(mouseUnitRay.Origin, mouseUnitRay.Direction.mul(1000), raycastParams);
	}

	didMount() {
		UserInputService.InputBegan.Connect((inputObject, gameProcessted) => {
			if (gameProcessted) return;
			if (!this.props.Activated) return;
			if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
				const target = this.raycastMouse();
				if (!target) return;
				this.props.UpdateColorPickerActivated();
				this.motor.setGoal(new Spring(0));
				this.props.UpdateColor(target.Instance.Color);
			}
		});
	}
}

export default connect(
	(state: IState, props: PickColorButtonPropTypes) => ({ Activated: state.ActivatedColorPicker === props.Id }),
	(dispatch) => ({
		UpdateColorPickerActivated(activated?: string | undefined) {
			dispatch(updateColorPickerActivated(activated));
		},
	}),
)(PickColorButton);
