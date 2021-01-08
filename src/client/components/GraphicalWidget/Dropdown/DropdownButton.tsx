import Roact, { RoactBinding } from "@rbxts/roact";

interface DropdownButton {
	DisplayText: string;
	Handlers: RoactEvents<TextButton>;
	Binding: RoactBinding<number>;
}

function DropdownButton(props: DropdownButton) {
	return (
		<textbutton
			AnchorPoint={new Vector2(1, 0.5)}
			BackgroundColor3={Color3.fromRGB(60, 60, 60)}
			Position={new UDim2(0.98, 0, 0.5, 0)}
			Size={UDim2.fromOffset(135, 18)}
			Font={Enum.Font.GothamBold}
			AutoButtonColor={false}
			Text={`  ${props.DisplayText}`}
			TextColor3={Color3.fromRGB(217, 217, 217)}
			TextSize={12}
			TextXAlignment={Enum.TextXAlignment.Left}
			Event={props.Handlers}
		>
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.925, 0.5)}
				Size={UDim2.fromOffset(18, 18)}
				ZIndex={2}
				Rotation={props.Binding.map((value) => value * 90)}
				ImageColor3={props.Binding.map((value) =>
					Color3.fromRGB(163, 162, 165).Lerp(Color3.fromRGB(66, 126, 193), value),
				)}
				Image="rbxassetid://3926305904"
				ImageRectOffset={new Vector2(924, 884)}
				ImageRectSize={new Vector2(36, 36)}
				ScaleType={Enum.ScaleType.Fit}
			/>
			<uicorner CornerRadius={new UDim(0, 5)} />
		</textbutton>
	);
}

export default DropdownButton;
