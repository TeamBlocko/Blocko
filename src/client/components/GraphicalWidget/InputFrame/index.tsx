import Roact, { Component } from "@rbxts/roact";
import GWFrame from "client/components/misc/GWFrame";
import TitleText from "client/components/misc/TitleText";

interface InputFramePropTypes {
	Name: string;
	Length: number;
}

class InputFrame extends Component<InputFramePropTypes> {
	render() {
		return (
			<GWFrame SizeOffsetY={this.props.Length}>
				<uicorner />
				<TitleText Text={this.props.Name} PosScaleY={0.25} Size={new UDim2(1, 0, 0, 20)} />
				<frame
					BackgroundColor3={new Color3(1, 1, 1)}
					BackgroundTransparency={0.95}
					Size={new UDim2(0.95, 0, 0, 100)}
				>
					<uicorner CornerRadius={new UDim(0, 5)} />
					<textbox
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={new UDim2(0.95, 0, 0, this.props.Length - 40)}
						Font={Enum.Font.GothamSemibold}
						Text=""
						TextColor3={Color3.fromRGB(218, 218, 218)}
						TextSize={15}
						TextYAlignment={Enum.TextYAlignment.Top}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
				</frame>
				<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} />
			</GWFrame>
		);
	}
}

export default InputFrame;
