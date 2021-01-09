import Roact from "@rbxts/roact";

interface ContainerPropTypes extends PropTypes {
	RefValue?: Roact.Ref<Frame>;
	SizeOffsetY: number;
}

function GWFrame(props: ContainerPropTypes) {
	return (
		<frame
			Ref={props.RefValue}
			BackgroundColor3={new Color3(1, 1, 1)}
			BackgroundTransparency={0.95}
			Size={new UDim2(0.975, 0, 0, props.SizeOffsetY)}
			ZIndex={10}
		>
			{props[Roact.Children]}
		</frame>
	);
}

export default GWFrame;
