import Roact from "@rbxts/roact";

interface CheckBoxElementPropTypes {
	Fill?: boolean;
	Value?: boolean;
	ScaleType?: Enum.ScaleType;
	[Roact.Children]?: RoactNode;
	HandleInput: () => void;
}

const Border = {
	Position: UDim2.fromScale(0.925, 0.5),
	ScaleType: Enum.ScaleType.Fit,
	Image: "rbxassetid://3926305904",
	ImageRectOffset: new Vector2(724, 724),
	ImageRectSize: new Vector2(36, 36),
};

const Icon = {
	Position: UDim2.fromScale(0.5, 0.5),
	Image: "rbxassetid://3926311105",
	ImageRectOffset: new Vector2(4, 836),
	ImageRectSize: new Vector2(48, 48),
};

function CheckBoxElement(props: CheckBoxElementPropTypes) {
	const elementType = !props.Fill ? Border : Icon;
	return (
		<imagebutton
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Size={UDim2.fromOffset(20, 20)}
			Visible={props.Value}
			Event={{
				Activated: () => props.HandleInput(),
			}}
			{...elementType}
		>
			{props[Roact.Children]}
		</imagebutton>
	);
}

export default CheckBoxElement;
