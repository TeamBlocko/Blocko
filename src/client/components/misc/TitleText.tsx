import Roact from "@rbxts/roact";

interface TitleTextPropTypes {
	Text: string;
	PosScaleY: number;
	SizeOffsetX?: number;
}

function TitleText(props: TitleTextPropTypes): Roact.Element {
	return (
		<textlabel
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, props.PosScaleY)}
			Size={props.SizeOffsetX !== undefined ? UDim2.fromOffset(props.SizeOffsetX, 14) : new UDim2(1, 0, 0, 14)}
			Font={Enum.Font.GothamSemibold}
			Text={`  ${props.Text}`}
			TextColor3={Color3.fromRGB(184, 184, 184)}
			TextScaled={true}
			TextSize={15}
			TextWrapped={true}
			TextXAlignment={Enum.TextXAlignment.Left}
		/>
	);
}

export default TitleText;
