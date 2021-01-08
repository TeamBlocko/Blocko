import Roact from "@rbxts/roact";

function ElementSeperator() {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundColor3={new Color3(1, 1, 1)}
			BackgroundTransparency={0.95}
			Size={new UDim2(0.9, 0, 0, 5)}
		>
			<uicorner CornerRadius={new UDim(1, 0)} />
		</frame>
	);
}

export default ElementSeperator;
