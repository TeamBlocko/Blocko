import Roact, { Component } from "@rbxts/roact";
import GWFrame from "client/components/misc/GWFrame";
import TitleText from "client/components/misc/TitleText";

interface InputFramePropTypes extends PropTypes, GWPropTypes<string> {
	Length: number;
	HandleInput?: (input: string) => string;
}

class InputFrame extends Component<InputFramePropTypes> {
	render() {
		return (
			<GWFrame SizeOffsetY={this.props.Length}>
				<uicorner />
				{this.props[Roact.Children]}
				<TitleText Text={this.props.Name} PosScaleY={0.25} Size={new UDim2(1, 0, 0, 20)} />
				<frame
					BackgroundColor3={new Color3(1, 1, 1)}
					BackgroundTransparency={0.95}
					Size={new UDim2(0.95, 0, 0, this.props.Length - 25)}
				>
					<uicorner CornerRadius={new UDim(0, 5)} />
					<textbox
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(0.95, 0.95)}
						Font={Enum.Font.GothamSemibold}
						Text={this.props.Default}
						ClearTextOnFocus={false}
						TextColor3={Color3.fromRGB(218, 218, 218)}
						TextWrapped={true}
						TextSize={15}
						TextYAlignment={Enum.TextYAlignment.Top}
						TextXAlignment={Enum.TextXAlignment.Left}
						Change={{
							Text: (e) => {
								const text = this.props.HandleInput ? this.props.HandleInput(e.Text) : e.Text
								if (e.Text === text)
									this.props.OnChange(text)
								else
									e.Text = text
							}
						}}
					/>
				</frame>
				<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} />
			</GWFrame>
		);
	}
}

export default InputFrame;
