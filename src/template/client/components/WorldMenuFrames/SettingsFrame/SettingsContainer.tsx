import Roact from "@rbxts/roact";

function WorldMenuFramesContainer(props: PropTypes) {
	const [binding, setBinding] = Roact.createBinding(0);
	return (
		<frame BackgroundTransparency={1} Size={binding.map((value) => new UDim2(0.95, 0, 0, value))}>
			<uilistlayout
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				Padding={new UDim(0, 5)}
				Change={{ AbsoluteContentSize: (e) => setBinding(e.AbsoluteContentSize.Y) }}
			/>
			<Roact.Fragment>{props[Roact.Children]}</Roact.Fragment>
		</frame>
	);
}

export default WorldMenuFramesContainer;
