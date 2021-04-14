import Roact from "@rbxts/roact";
import { Notification, NotificationPropTypes } from "./Notification";
import { map } from "template/shared/utility";

export class ApplyPrompt extends Notification {
	constructor(props: NotificationPropTypes) {
		super(props);
	}

	render() {
		return (
			<frame
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={new Color3()}
				BackgroundTransparency={this.binding.map((value) => map(value.Transparency, 0, 1, 0.5, 1))}
				Position={this.binding.map((value) => {
					const frame = this.frameRef.getValue();
					if (frame) return frame.Position.Lerp(this.props.Position, value.Position);
					return this.props.Position;
				})}
				Size={UDim2.fromOffset(550, 50)}
				Ref={this.frameRef}
			>
				<textlabel
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundColor3={new Color3(1, 1, 1)}
					BackgroundTransparency={1}
					Position={new UDim2(0, 65, 0.5, 0)}
					Size={UDim2.fromOffset(350, 20)}
					Font={Enum.Font.GothamSemibold}
					Text="You have unapplied changed! "
					TextTransparency={this.binding.map((value) => value.Transparency)}
					TextColor3={new Color3(1, 1, 1)}
					TextSize={18}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
				<frame
					AnchorPoint={new Vector2(1, 0.5)}
					BackgroundColor3={new Color3(1, 1, 1)}
					BackgroundTransparency={1}
					Position={new UDim2(1, -25, 0.5, 0)}
					Size={UDim2.fromOffset(250, 25)}
				>
					<textbutton
						BackgroundTransparency={1}
						Size={UDim2.fromOffset(65, 20)}
						Font={Enum.Font.Gotham}
						Text="Cancel"
						TextTransparency={this.binding.map((value) => value.Transparency)}
						TextColor3={Color3.fromRGB(214, 214, 214)}
						TextSize={18}
						TextWrapped={true}
						Event={{
							Activated: () => this.props.OnCancelPrompt?.(),
						}}
					/>
					<textbutton
						BackgroundTransparency={1}
						Size={UDim2.fromOffset(65, 20)}
						Font={Enum.Font.Gotham}
						Text="Apply"
						TextTransparency={this.binding.map((value) => value.Transparency)}
						TextColor3={Color3.fromRGB(66, 183, 255)}
						TextSize={18}
						TextWrapped={true}
						Event={{
							Activated: () => this.props.OnApplyPrompt?.(),
						}}
					/>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Right}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						Padding={new UDim(0, 5)}
					/>
				</frame>
				<uicorner />
				<imagebutton
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundTransparency={1}
					Position={new UDim2(0, 25, 0.5, 0)}
					Size={UDim2.fromOffset(25, 25)}
					Image="rbxassetid://3926305904"
					ImageRectOffset={new Vector2(364, 324)}
					ImageRectSize={new Vector2(36, 36)}
					ImageTransparency={this.binding.map((value) => value.Transparency)}
				/>
			</frame>
		);
	}
}
