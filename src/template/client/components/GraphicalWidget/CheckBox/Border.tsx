import Roact from "@rbxts/roact";

interface CheckBoxElementPropTypes extends Roact.PropsWithChildren {
	Position?: UDim2;
	HandleInput: () => void;
}

function CheckBoxElement(props: CheckBoxElementPropTypes) {
	return (
		<imagebutton
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Size={UDim2.fromOffset(20, 20)}
			Event={{
				Activated: () => props.HandleInput(),
			}}
			Position={props.Position ? props.Position : UDim2.fromScale(0.925, 0.5)}
			ScaleType={Enum.ScaleType.Fit}
			Image="rbxassetid://3926305904"
			ImageRectOffset={new Vector2(724, 724)}
			ImageRectSize={new Vector2(36, 36)}
		>
			{props[Roact.Children]}
		</imagebutton>
	);
}

export default CheckBoxElement;
