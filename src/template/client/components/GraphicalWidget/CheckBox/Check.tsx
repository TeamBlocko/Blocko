import Roact from "@rbxts/roact";

interface Check {
	Value: boolean;
	HandleInput: () => void;
}

function CheckBoxElement(props: Check) {
	return (
		<imagebutton
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Size={UDim2.fromOffset(20, 20)}
			Visible={props.Value}
			Event={{
				Activated: () => props.HandleInput(),
			}}
			Position={UDim2.fromScale(0.5, 0.5)}
			Image="rbxassetid://3926311105"
			ImageRectOffset={new Vector2(4, 836)}
			ImageRectSize={new Vector2(48, 48)}
		/>
	);
}

export default CheckBoxElement;
