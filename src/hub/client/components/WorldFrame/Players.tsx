import Roact from "@rbxts/roact";

interface PlayersCountPropTypes {
	Current: number;
	Max: number;
}

function PlayersCount(props: PlayersCountPropTypes) {
	return (
		<imagelabel
			Active={true}
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.715, 0.25)}
			Image={"rbxassetid://3926305904"}
			ImageRectOffset={new Vector2(4, 844)}
			ImageRectSize={new Vector2(36, 36)}
			ScaleType={Enum.ScaleType.Fit}
		>
			<textlabel
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(1.25, 0.5)}
				Size={UDim2.fromScale(5, 0.7)}
				Font={Enum.Font.GothamSemibold}
				Text={`${props.Current}/${props.Max}`}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
				TextWrapped={true}
				TextSize={14}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
		</imagelabel>
	);
}

export default PlayersCount;
