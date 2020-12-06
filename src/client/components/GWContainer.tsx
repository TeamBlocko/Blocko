import Roact from "@rbxts/roact";

interface ContainerPropTypes extends PropTypes {
	SizeOffsetY: number;
}

function GWContainer(props: ContainerPropTypes) {
	return (
		<frame
			Key={props.Name}
			BackgroundColor3={new Color3(1, 1, 1)}
			BackgroundTransparency={0.95}
			Size={new UDim2(0.975, 0, 0, props.SizeOffsetY)}
			ZIndex={10}
			LayoutOrder={props.LayoutOrder}
		>
			{props[Roact.Children]}
		</frame>
	);
}

export default GWContainer;
