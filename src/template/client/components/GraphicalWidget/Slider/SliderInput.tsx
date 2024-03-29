import Roact from "@rbxts/roact";
import NumberInput from "template/client/components/misc/NumberInput";

interface SliderInputPropTypes extends SliderDisplayPropTypes {
	OnTextChange: (e: TextBox) => void;
	Binding: Roact.Binding<number>;
	DecimalPlace?: number;
}

function SliderInput(props: SliderInputPropTypes) {
	return (
		<NumberInput
			TextBoxProps={{
				AnchorPoint: new Vector2(0.5, 0.5),
				BackgroundColor3: Color3.fromRGB(60, 60, 60),
				BackgroundTransparency: props.Binding.map((value) => value),
				Position: UDim2.fromScale(0.5, -0.5),
				Size: UDim2.fromOffset(20, 12),
				Transparency: props.Binding.map((value) => value),
				Font: Enum.Font.Gotham,
				Text: `${props.Value}`,
				TextColor3: Color3.fromRGB(89, 161, 255),
				TextWrapped: true,
			}}
			ValidationHandler={(input) => {
				const [match] = input.match("[%d%.]+");
				if (match) {
					const num = math.clamp(tonumber(match)!, props.Range.Min, props.Range.Max);
					const decimalPlaceNum = `%.${props.DecimalPlace}f`.format(tostring(num));
					return decimalPlaceNum;
				}
			}}
			OnValidInput={(e) => props.OnTextChange(e)}
		>
			<uicorner CornerRadius={new UDim(0, 4)} />
		</NumberInput>
	);
}

export default SliderInput;
