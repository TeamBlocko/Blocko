import Roact from "@rbxts/roact";

function Search() {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={new Color3(1, 1, 1)}
			Position={UDim2.fromScale(0.5, 0.32)}
			Selectable={true}
			Size={UDim2.fromScale(0.425, 0.075)}
		>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<imagebutton
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.035, 0.5)}
				Size={UDim2.fromScale(0.047, 0.429)}
				Image={"rbxassetid://3926305904"}
				ImageColor3={Color3.fromRGB(185, 185, 185)}
				ImageRectOffset={new Vector2(964, 324)}
				ImageRectSize={new Vector2(36, 36)}
				ScaleType={Enum.ScaleType.Fit}
			/>
			<textbox
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.1, 0.5)}
				Size={UDim2.fromScale(0.6, 0.35)}
				Font={Enum.Font.Gotham}
				PlaceholderColor3={Color3.fromRGB(185, 185, 185)}
				PlaceholderText={"Search"}
				Text={""}
				TextColor3={Color3.fromRGB(150, 150, 150)}
				TextScaled={true}
				TextSize={12}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<frame
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundColor3={Color3.fromRGB(240, 240, 240)}
				Position={UDim2.fromScale(0.735, 0.5)}
				Size={UDim2.fromScale(0.006, 0.6)}
			>
				<uicorner CornerRadius={new UDim(1, 0)} />
			</frame>
		</frame>
	);
}

export default Search;
