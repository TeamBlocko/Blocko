import Roact from "@rbxts/roact";

function FeaturedTag() {
	return (
		<frame BackgroundColor3={Color3.fromRGB(255, 223, 124)} Size={UDim2.fromScale(2.55, 0.2)}>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<textlabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 0.75)}
				Font={Enum.Font.GothamBlack}
				Text={"FEATURED"}
				TextColor3={Color3.fromRGB(24, 24, 24)}
				TextScaled={true}
				TextSize={14}
				TextWrapped={true}
			/>
		</frame>
	);
}

export default FeaturedTag;
