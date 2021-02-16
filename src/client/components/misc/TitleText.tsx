import Roact from "@rbxts/roact";

interface TitleTextPropTypes extends RbxJsxProps {
	Text: string;
	PosScaleY: number;
	Size?: UDim2;
}

function TitleText(props: TitleTextPropTypes): Roact.Element {
	return (
		<textlabel
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, props.PosScaleY)}
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
