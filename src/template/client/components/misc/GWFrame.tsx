import Roact from "@rbxts/roact";

interface ContainerPropTypes extends PropTypes {
	RefValue?: Roact.Ref<Frame>;
	SizeOffsetY: number | Roact.RoactBinding<number>;
	ZIndex?: number;
	BackgroundTransparency?: number;
	LayoutOrder?: number;
}

function GWFrame(props: ContainerPropTypes) {
	return (
		<frame
			Ref={props.RefValue}
			ZIndex={props.ZIndex ?? 10}
			BackgroundColor3={new Color3(1, 1, 1)}
			LayoutOrder={props.LayoutOrder}
			BackgroundTransparency={props.BackgroundTransparency ?? 0.95}
			Size={typeIs(props.SizeOffsetY, "number") ? new UDim2(0.975, 0, 0, props.SizeOffsetY) : props.SizeOffsetY.map(value => new UDim2(0.975, 0, 0, value)) }
		>
			{props[Roact.Children]}
		</frame>
	);
}

export default GWFrame;
