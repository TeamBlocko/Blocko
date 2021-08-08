import Roact from "@rbxts/roact";
import Flipper from "@rbxts/flipper";
import WorldCreationFrame from "./WorldCreationFrame";
import { popupFrameContext, Popup } from "../popupFramesContext";
import { map } from "common/shared/utility";

interface PopupFramesPropTypes {
	VisibleFrame?: Popup;
}

class PopupFrames extends Roact.Component<PopupFramesPropTypes> {
	binding: Roact.Binding<number>;
	setBinding: Roact.BindingFunction<number>;
	motor: Flipper.SingleMotor;

	constructor(props: PopupFramesPropTypes) {
		super(props);

		[this.binding, this.setBinding] = Roact.createBinding(props.VisibleFrame === undefined ? 0 : 1);

		this.motor = new Flipper.SingleMotor(this.binding.getValue());
		this.motor.onStep(this.setBinding);
	}

	didUpdate() {
		this.motor.setGoal(new Flipper.Spring(this.props.VisibleFrame === undefined ? 0 : 1));
	}

	render() {
		return (
			<frame
				BackgroundTransparency={this.binding.map((value) => map(1 - value, 0, 1, 0.5, 1))}
				Size={UDim2.fromScale(1, 1)}
				BackgroundColor3={new Color3()}
				ZIndex={3}
			>
				{this.props.VisibleFrame?.name === "Create" ? (
					<WorldCreationFrame Position={this.binding} />
				) : undefined}
			</frame>
		);
	}
}

export default () => <popupFrameContext.Consumer render={(value) => <PopupFrames VisibleFrame={value.OpenPopup} />} />;
