import Roact, { PropsWithChildren } from "@rbxts/roact";

interface TitleTextPropTypes extends PropsWithChildren {
	Text: string;
	Size?: UDim2;
	AnchorPoint?: Vector2;
	Position?: UDim2;
	TextXAlignment?: Enum.TextXAlignment;
}

function TitleText(props: TitleTextPropTypes): Roact.Element {
	return (
		<textlabel
			BackgroundTransparency={1}
			AnchorPoint={props.AnchorPoint}
			Position={props.Position ?? UDim2.fromOffset(0, 5)}
			Size={props.Size !== undefined ? props.Size : new UDim2(1, 0, 0, 14)}
			Font={Enum.Font.GothamSemibold}
			Text={`  ${props.Text}`}
			TextColor3={Color3.fromRGB(184, 184, 184)}
			TextSize={14}
			TextXAlignment={props.TextXAlignment ?? Enum.TextXAlignment.Left}
		>
			{props[Roact.Children]}
		</textlabel>
	);
}

export default TitleText;
