import Roact from "@rbxts/roact";

interface TopFramePropTypes extends Roact.PropsWithChildren {
	Title: string;
	Description: string;
}

function TopFrame(props: TopFramePropTypes) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.065)}
			Size={UDim2.fromScale(0.85, 0.2)}
		>
			<textlabel
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.17)}
				Size={UDim2.fromScale(1, 0.35)}
				Font={Enum.Font.GothamBold}
				Text={props.Title}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
				TextSize={14}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<textlabel
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.3)}
				Size={UDim2.fromScale(1, 0.5)}
				Font={Enum.Font.Gotham}
				Text={props.Description}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
				TextSize={14}
				TextTransparency={0.25}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<>{props[Roact.Children]}</>
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0.075, 0)} />
		</frame>
	);
}

export default TopFrame;
