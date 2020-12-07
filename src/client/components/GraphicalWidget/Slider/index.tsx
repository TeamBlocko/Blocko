import Roact, { Component } from "@rbxts/roact";
import TitleText from "client/components/TitleText";
import GWContainer from "client/components/GWContainer";

class Slider<T> extends Component<SliderPropTypes<T>, {}> {
	render() {
		return (
			<GWContainer
				Name={this.props.Name}
				LayoutOrder={this.props.LayoutOrder}
				SizeOffsetY={55}
			>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<TitleText Name="Transparency" PosScaleY={0.225} />
				
			</GWContainer>
		);
	}
}

export default Slider;
