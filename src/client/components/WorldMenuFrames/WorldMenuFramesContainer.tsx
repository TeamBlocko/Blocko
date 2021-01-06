import Roact from "@rbxts/roact";

function WorldMenuFramesContainer(props: PropTypes & { RefValue: Roact.Ref<Frame> }) {
	return (
		<frame
			Ref={props.RefValue}
			BackgroundColor3={Color3.fromRGB(57, 57, 57)}
			BackgroundTransparency={1}
			BorderColor3={new Color3()}
			BorderSizePixel={0}
			ClipsDescendants={true}
			LayoutOrder={1}
			Size={UDim2.fromScale(1, 1)}
		>
			{props[Roact.Children]}
		</frame>
	);
}

export default WorldMenuFramesContainer;
