import Roact from "@rbxts/roact";

export function Title() {
	return (
		<textlabel
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(27, 42, 53)}
			Size={new UDim2(0.95, 0, 0, 20)}
			Font={Enum.Font.GothamBold}
			Text="nyazem's World #1"
			TextColor3={new Color3(1, 1, 1)}
			TextSize={17}
			LayoutOrder={0}
			TextXAlignment={Enum.TextXAlignment.Left}
			TextYAlignment={Enum.TextYAlignment.Top}
		/>
	);
}

export function Description() {
	return (
		<textlabel
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(27, 42, 53)}
			LayoutOrder={2}
			Size={UDim2.fromScale(0.95, 1)}
			Font={Enum.Font.Gotham}
			Text="No description set."
			TextColor3={new Color3(1, 1, 1)}
			TextSize={17}
			TextXAlignment={Enum.TextXAlignment.Left}
			TextYAlignment={Enum.TextYAlignment.Top}
		/>
	);
}
