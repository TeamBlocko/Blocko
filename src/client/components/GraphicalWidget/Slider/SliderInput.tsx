import Roact, { RoactBinding } from "@rbxts/roact";
import NumberInput from "client/components/misc/NumberInput";

function SliderInput(
	props: SliderDisplayPropTypes & { OnTextChange: (e: TextBox) => void; Binding: RoactBinding<number> },
) {
	return (
		<NumberInput
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(60, 60, 60)}
			BackgroundTransparency={props.Binding.map((value) => value)}
			Position={UDim2.fromScale(0.5, -0.5)}
			Size={UDim2.fromOffset(20, 12)}
			Transparency={props.Binding.map((value) => value)}
			Font={Enum.Font.Gotham}
			Text={"%.2f".format(`${props.Value}`)}
			TextColor3={Color3.fromRGB(89, 161, 255)}
			TextWrapped={true}
			OnValidInput={(e) => props.OnTextChange(e)}
			Options={{
				Range: props.Range,
			}}
		>
			<uicorner CornerRadius={new UDim(0, 4)} />
		</NumberInput>
	);
}

export default SliderInput;
