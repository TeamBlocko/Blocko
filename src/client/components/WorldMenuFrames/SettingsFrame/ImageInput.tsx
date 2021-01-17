import Roact from "@rbxts/roact";

function ImageInput() {
	return (
		<imagebutton
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundColor3={new Color3(1, 1, 1)}
			BackgroundTransparency={0.95}
			Size={UDim2.fromOffset(240, 140)}
			Image=""
			ScaleType={Enum.ScaleType.Crop}
		>
			<uicorner CornerRadius={new UDim(0, 5)} />
			<textbox
				BackgroundColor3={new Color3()}
				BackgroundTransparency={0.85}
				Size={UDim2.fromScale(1, 1)}
				Font={Enum.Font.GothamBold}
				Text=""
				TextColor3={new Color3(1, 1, 1)}
				TextSize={18}
				TextStrokeTransparency={0.75}
			>
				<uicorner CornerRadius={new UDim(0, 5)} />
			</textbox>
		</imagebutton>
	);
}

export default ImageInput;
