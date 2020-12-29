import Roact from "@rbxts/roact";
import { inverseColor } from "shared/utility";

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
			<imagelabel
				Active={true}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromOffset(12, 12)}
				BackgroundTransparency={1}
				Image="rbxassetid://3926305904"
				ImageColor3={inverseColor(props.Value)}
				ImageRectOffset={new Vector2(284, 644)}
				ImageRectSize={new Vector2(36, 36)}
				ScaleType={Enum.ScaleType.Fit}
				SliceScale={0.5}
			/>
		</textbutton>
	);
}

export default PickButton;
