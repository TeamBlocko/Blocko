import Roact, { Component } from "@rbxts/roact";
import GWContainer from "../../GWContainer";

class Slider<T> extends Component<SliderPropTypes<T>, {}> {
	render() {
		return (
			<GWContainer
				Name={this.props.Name}
				LayoutOrder={this.props.LayoutOrder}
				SizeOffsetY={55}
			>
			</GWContainer>
		);
	}
}

export default Slider;
