import Roact from "@rbxts/roact";

function PickColorButton() {
	return (
		<imagebutton
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.1, 0.9)}
			Size={UDim2.fromOffset(20, 20)}
			Image="rbxassetid://3926305904"
			ImageRectOffset={new Vector2(804, 924)}
			ImageRectSize={new Vector2(36, 36)}
		/>
	);
}

export default PickColorButton;
