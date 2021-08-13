import Roact from "@rbxts/roact";

class ImageInput extends Roact.Component<GWPropTypes<string>> {
	prevText: string | undefined;

	render() {
		return (
			<imagebutton
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={0.95}
				Size={UDim2.fromOffset(240, 140)}
				Image={this.props.Default}
				ScaleType={Enum.ScaleType.Crop}
				LayoutOrder={this.props.LayoutOrder}
			>
				<uicorner CornerRadius={new UDim(0, 5)} />
				<textbox
					BackgroundColor3={new Color3()}
					BackgroundTransparency={0.85}
					Size={UDim2.fromScale(1, 1)}
					Font={Enum.Font.GothamBold}
					PlaceholderText={this.props.Name}
					Text={this.props.Default}
					TextColor3={new Color3(1, 1, 1)}
					TextSize={18}
					ClearTextOnFocus={false}
					TextStrokeTransparency={0.75}
					Change={{
						Text: ({ Text: text }) => {
							const [id] = text.match("%d+");
							if (!id) return;
							this.props.OnChange(`rbxassetid://${id}`);
							this.prevText = tostring(id);
						},
					}}
					Event={{
						FocusLost: (e) => {
							if (e.Text !== "" || this.prevText === undefined) return;
							e.Text = this.prevText;
						},
					}}
				>
					<uicorner CornerRadius={new UDim(0, 5)} />
				</textbox>
			</imagebutton>
		);
	}
}

export default ImageInput;
