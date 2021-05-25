import Roact from "@rbxts/roact";

class WorldMenuFramesContainer extends Roact.Component<PropTypes> {

	binding: Roact.RoactBinding<number>;
	setBinding: Roact.RoactBindingFunc<number>;

	constructor(props: PropTypes) {
		super(props);

		[this.binding, this.setBinding] = Roact.createBinding(0)
	}

	render() {
		return (
			<frame BackgroundTransparency={1} Size={this.binding.map((value) => new UDim2(0.95, 0, 0, value))}>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Padding={new UDim(0, 5)}
					Change={{ AbsoluteContentSize: (e) => this.setBinding(e.AbsoluteContentSize.Y) }}
				/>
				<Roact.Fragment>{this.props[Roact.Children]}</Roact.Fragment>
			</frame>
		);
	}
}

export default WorldMenuFramesContainer;
