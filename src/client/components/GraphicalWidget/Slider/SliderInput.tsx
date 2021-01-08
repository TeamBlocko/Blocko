import Roact from "@rbxts/roact";
import NumberInput from "client/components/misc/NumberInput";

function SliderInput(props: SliderDisplayPropTypes & { OnTextChange: (e: TextBox) => void }) {
	return (
		<NumberInput
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(60, 60, 60)}
			BackgroundTransparency={0}
			Position={UDim2.fromScale(0.5, -0.5)}
			Size={UDim2.fromOffset(20, 12)}
			Font={Enum.Font.Gotham}
			Text={tostring(props.Value)}
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
