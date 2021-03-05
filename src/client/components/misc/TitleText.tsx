import Roact from "@rbxts/roact";

interface TitleTextPropTypes extends RbxJsxProps {
	Text: string;
	Size?: UDim2;
	YOffset?: number;
}

function TitleText(props: TitleTextPropTypes): Roact.Element {
	return (
		<textlabel
			BackgroundTransparency={1}
			Position={UDim2.fromOffset(0, props.YOffset ?? 5)}
			Size={props.Size !== undefined ? props.Size : new UDim2(1, 0, 0, 14)}
			Font={Enum.Font.GothamSemibold}
			Text={`  ${props.Text}`}
			TextColor3={Color3.fromRGB(184, 184, 184)}
			TextSize={14}
			TextXAlignment={Enum.TextXAlignment.Left}
		>
			{props[Roact.Children]}
		</textlabel>
	);
}

export default TitleText;
