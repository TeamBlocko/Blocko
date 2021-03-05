import Roact from "@rbxts/roact";

interface ContainerPropTypes extends PropTypes {
	RefValue?: Roact.Ref<Frame>;
	SizeOffsetY: number;
	ZIndex?: number;
	LayoutOrder?: number;
}

function GWFrame(props: ContainerPropTypes) {
	return (
		<frame
			Ref={props.RefValue}
			ZIndex={props.ZIndex ?? 10}
			BackgroundColor3={new Color3(1, 1, 1)}
			LayoutOrder={props.LayoutOrder}
			BackgroundTransparency={0.95}
			Size={new UDim2(0.975, 0, 0, props.SizeOffsetY)}
		>
			{props[Roact.Children]}
		</frame>
	);
}

export default GWFrame;
