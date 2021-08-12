import Roact from "@rbxts/roact";

function LikeButton(props: { Transparency: Roact.Binding<number> }) {
	return (
		<imagebutton
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.714, 0.25)}
			Image={"rbxassetid://3926305904"}
			ImageRectOffset={new Vector2(764, 284)}
			ImageRectSize={new Vector2(36, 36)}
			ImageTransparency={props.Transparency}
			ScaleType={Enum.ScaleType.Fit}
		>
			<imagelabel
				Active={true}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(1, 1)}
				Selectable={true}
				Image={"rbxassetid://3926305904"}
				ImageTransparency={props.Transparency}
				ImageRectOffset={new Vector2(964, 444)}
				ImageRectSize={new Vector2(36, 36)}
				ScaleType={Enum.ScaleType.Fit}
			/>
		</imagebutton>
	);
}

export default LikeButton;
