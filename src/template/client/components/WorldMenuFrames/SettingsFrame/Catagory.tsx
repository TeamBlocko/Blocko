import { TextService } from "@rbxts/services";
import Roact from "@rbxts/roact";

interface CatagoryPropTypes {
	Text: string;
	Image: string;
}

class Catagory extends Roact.Component<CatagoryPropTypes> {

	binding: Roact.RoactBinding<number>;
	setBinding: Roact.RoactBindingFunc<number>;

	constructor(props: CatagoryPropTypes) {
		super(props);

		[this.binding, this.setBinding] = Roact.createBinding(0);
	}

	render() {
		const textSize = TextService.GetTextSize(` ${this.props.Text}`, 14, Enum.Font.GothamSemibold, new Vector2()).X + 20;
		return (
			<frame
				BackgroundTransparency={1}
				Size={new UDim2(0.95, 0, 0, 17)}
				Change={{ AbsoluteSize: (e) => this.setBinding(e.AbsoluteSize.X) }}
			>
				<imagelabel
					Active={true}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Size={UDim2.fromOffset(20, 20)}
					Image={this.props.Image}
					ImageColor3={Color3.fromRGB(208, 208, 208)}
					ImageRectOffset={new Vector2(524, 444)}
					ImageRectSize={new Vector2(36, 36)}
					ScaleType={Enum.ScaleType.Fit}
				/>
				<textlabel
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundTransparency={1}
					Size={UDim2.fromOffset(textSize, 17)}
					Font={Enum.Font.GothamSemibold}
					Text={` ${this.props.Text}`}
					TextColor3={Color3.fromRGB(208, 208, 208)}
					TextSize={14}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
				<frame
					AnchorPoint={new Vector2(1, 0.5)}
					BackgroundColor3={new Color3(1, 1, 1)}
					BackgroundTransparency={0.9}
					BorderSizePixel={0}
					Size={this.binding.map((value) => UDim2.fromOffset(value - textSize - 20, 2))}
				/>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
			</frame>
		);
	}
}

export default Catagory;
