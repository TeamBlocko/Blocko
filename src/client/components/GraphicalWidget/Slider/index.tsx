import Roact, { Component } from "@rbxts/roact";

class Slider<T> extends Component<SliderPropTypes<T>, {}> {
	render() {
		return (
			<frame
				Key={this.props.Name}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={0.95}
				LayoutOrder={this.props.LayoutOrder}
				Size={new UDim2(0.975, 0, 0, 55)}
			>
			</frame>
		);
	}
}

export default Slider;
