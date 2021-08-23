import Roact, { Component } from "@rbxts/roact";
import { UserInputService } from "@rbxts/services";

interface ValueFramePropTypes {
	RefValue: Roact.Ref<TextButton>;
	Manager: ColorPickerManager;
}

class ValueFrame extends Component<ValueFramePropTypes> {
	inputBegan: RBXScriptConnection | undefined;
	inputEnded: RBXScriptConnection | undefined;
	inputChanged: RBXScriptConnection | undefined;

	render() {
		const position = this.props.Manager.getValueFramePosition();
		return (
			<textbutton
				Ref={this.props.RefValue}
				AnchorPoint={new Vector2(1, 0.5)}
				BackgroundColor3={new Color3(1, 1, 1)}
				Size={UDim2.fromOffset(175, 20)}
				Text=""
			>
				<uicorner />
				<uigradient Color={this.props.Manager.getColorSeq()} />
				<imagelabel
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Position={position}
					Size={UDim2.fromOffset(6, 6)}
					Image="rbxassetid://5537526288"
					ScaleType={Enum.ScaleType.Fit}
				/>
			</textbutton>
		);
	}

	didMount() {
		this.inputBegan = UserInputService.InputBegan.Connect((inputObject) =>
			this.props.Manager.HandleValueInput(inputObject),
		);
		this.inputEnded = UserInputService.InputEnded.Connect((inputObject) =>
			this.props.Manager.HandleValueInput(inputObject),
		);
		this.inputChanged = UserInputService.InputChanged.Connect((inputObject) =>
			this.props.Manager.HandleValueInput(inputObject),
		);
	}

	willUnmount() {
		this.inputBegan?.Disconnect();
		this.inputEnded?.Disconnect();
		this.inputChanged?.Disconnect();
	}
}

export default ValueFrame;
