import Roact from "@rbxts/roact";
import GWFrame from "../../misc/GWFrame";
import TitleText from "../../misc/TitleText";
import NumberTextInput from "../../misc/NumberInput";

interface NumberInputPropTypes extends GWPropTypes<number> {
	SizeYOffset?: number;
	BackgroundTransparency?: number;
	ValidationHandler: (input: string) => string | undefined;
}

export class NumberInput extends Roact.Component<NumberInputPropTypes> {
	render() {
		return (
			<GWFrame
				SizeOffsetY={this.props.SizeYOffset ?? 30}
				LayoutOrder={this.props.LayoutOrder}
				BackgroundTransparency={this.props.BackgroundTransparency}
			>
				<TitleText
					Text={this.props.Name}
				/>
				<NumberTextInput
					OnValidInput={(_, value) => this.props.OnChange(value)}
					ValidationHandler={this.props.ValidationHandler}
					TextBoxProps={{
						BackgroundTransparency: 0.95,
						Size: UDim2.fromOffset(20, 20),
						TextColor3: new Color3(1, 1, 1),
						Text: tostring(this.props.Default),
						ClearTextOnFocus: false,
						AnchorPoint: new Vector2(1, 0.5),
						Position: UDim2.fromScale(0.925, 0.5),
						Font:Enum.Font.Gotham,
						AutomaticSize: Enum.AutomaticSize.X,
						TextSize: 16,
					}}
				>
					<uicorner CornerRadius={new UDim(0, 4)} />
				</NumberTextInput>
			</GWFrame>
		);
	}
}
