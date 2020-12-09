import Roact from "@rbxts/roact";

interface SliderNumberPropTypes {
	SizeOffsetY: number;
	Value: number;
}

function SliderNumber(props: SliderNumberPropTypes) {
	return (
		<textlabel
			Key="SliderNumber"
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={new Color3(1, 1, 1)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, -0.5)}
			Size={UDim2.fromOffset(20, props.SizeOffsetY)}
			Font={Enum.Font.Gotham}
			Text={tostring(props.Value)}
			TextColor3={Color3.fromRGB(152, 152, 152)}
			TextWrapped={true}
		>
			<uicorner CornerRadius={new UDim(0, 4)} />
		</textlabel>
	);
}

export default SliderNumber;
