import Roact, { Component } from "@rbxts/roact";
import Crosshair from "./Crosshair";
import { UserInputService } from "@rbxts/services";

interface HSFramePropTypes {
	RefValue: Roact.Ref<ImageButton>;
	Manager: ColorPickerManager;
}

class HueSaturationFrame extends Component<HSFramePropTypes> {
	inputBegan: RBXScriptConnection | undefined;
	inputEnded: RBXScriptConnection | undefined;
	inputChanged: RBXScriptConnection | undefined;

	render() {
		return (
			<imagebutton
				Ref={this.props.RefValue}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				BorderColor3={new Color3()}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromOffset(225, 220)}
				Image="http://www.roblox.com/asset/?id=181615068"
			>
				<Crosshair Manager={this.props.Manager} />
				<imagelabel
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={this.props.Manager.cvalue}
					BackgroundColor3={new Color3()}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					Image="rbxassetid://5690021401"
				/>
			</imagebutton>
		);
	}

	didMount() {
		this.inputBegan = UserInputService.InputBegan.Connect((inputObject) =>
			this.props.Manager.HandleInput(inputObject),
		);
		this.inputEnded = UserInputService.InputEnded.Connect((inputObject) =>
			this.props.Manager.HandleInput(inputObject),
		);
		this.inputChanged = UserInputService.InputChanged.Connect((inputObject) =>
			this.props.Manager.HandleInput(inputObject),
		);
	}

	willUnmount() {
		this.inputBegan?.Disconnect();
		this.inputEnded?.Disconnect();
		this.inputChanged?.Disconnect();
	}
}

export default HueSaturationFrame;
