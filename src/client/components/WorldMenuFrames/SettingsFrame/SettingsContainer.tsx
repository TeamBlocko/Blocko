import Roact from "@rbxts/roact";

function WorldMenuFramesContainer(props: PropTypes) {
	return (
		<frame BackgroundTransparency={1}>
			<uilistlayout
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				Padding={new UDim(0, 5)}
				Ref={(e) =>
					e.AncestryChanged.Connect(() => {
						const parent = e.Parent as Frame;
						const contentSize = e.AbsoluteContentSize;
						parent.Size = new UDim2(0.95, 0, 0, contentSize.Y);
					})
				}
			/>
			<Roact.Fragment>{props[Roact.Children]}</Roact.Fragment>
		</frame>
	);
}

export default WorldMenuFramesContainer;
