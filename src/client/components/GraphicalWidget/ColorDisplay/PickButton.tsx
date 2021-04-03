import Roact from "@rbxts/roact";

interface PickButton {
	Value: Color3;
	HandleClick: (rbx: TextButton, input: InputObject, b: number) => void;
}

function PickButton(props: PickButton) {
	return (
		<textbutton
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={props.Value}
			BorderColor3={Color3.fromRGB(27, 42, 53)}
			Position={UDim2.fromScale(0.92, 0.5)}
			Size={UDim2.fromOffset(18, 18)}
			TextTransparency={1}
			Event={{
				Activated: (...args) => props.HandleClick(...args),
			}}
		>
			<uicorner CornerRadius={new UDim(1, 0)} />
		</textbutton>
	);
}

export default PickButton;
