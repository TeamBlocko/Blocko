import Roact from "@rbxts/roact";

interface WorldCoverPropTypes {
	Image: string,
	ImageRectOffset: Vector2,
	ImageRectSize: Vector2,
	ImageTransparency?: number,
}

function WorldCover(props: WorldCoverPropTypes) {
	return (
		<frame
			BackgroundTransparency={1}
			Size={UDim2.fromScale(1, 1)}
		>
			<uicorner CornerRadius={new UDim(0.08)} />
			<imagelabel
				Active={true}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Selectable={true}
				Size={UDim2.fromOffset(30, 30)}
				{...props}
			/>
		</frame>
	)
}

export default WorldCover;