import Roact from "@rbxts/roact";

interface ValueFramePropTypes {
	RefValue: Roact.Ref<TextButton>;
	Manager: ColorPickerManager;
}

function ValueFrame(props: ValueFramePropTypes) {
	const position = props.Manager.getValueFramePosition();
	return (
		<textbutton
			Ref={props.RefValue}
			AnchorPoint={new Vector2(1, 0.5)}
			BackgroundColor3={new Color3(1, 1, 1)}
			Size={UDim2.fromOffset(175, 20)}
			Text=""
			Event={{
				InputBegan: (_, inputObject) => props.Manager.HandleValueInput(inputObject),
				InputEnded: (_, inputObject) => props.Manager.HandleValueInput(inputObject),
				InputChanged: (_, inputObject) => props.Manager.HandleValueInput(inputObject),
			}}
		>
			<uicorner />
			<uigradient Color={props.Manager.getColorSeq()} />
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={position}
				Size={UDim2.fromOffset(6, 6)}
				Image="rbxassetid://5537526288"
				ScaleType={Enum.ScaleType.Fit}
			/>
		</textbutton>
	);
}

export default ValueFrame;
