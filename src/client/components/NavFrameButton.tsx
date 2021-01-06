import Roact from "@rbxts/roact";

interface NavFrameButtonPropTypes {
	Text: string;
	Icon: string;
	Color: Color3;
	LayoutOrder: number;
	Transparency: number;
}

function NavFrameButton(props: NavFrameButtonPropTypes) {
	return (
		<textbutton
			BackgroundColor3={Color3.fromRGB(30, 30, 30)}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, 60)}
			AutoButtonColor={false}
			Font={Enum.Font.SourceSans}
			Text="0"
			TextColor3={new Color3()}
			TextSize={1}
			LayoutOrder={props.LayoutOrder}
		>
			<textlabel
				BackgroundTransparency={1}
				LayoutOrder={1}
				Size={UDim2.fromOffset(185, 25)}
				Font={Enum.Font.Gotham}
				Text={props.Text}
				TextColor3={props.Color}
				TextSize={18}
				TextTransparency={props.Transparency}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<imagelabel
				BackgroundTransparency={1}
				Position={UDim2.fromScale(-0.4, 0.6)}
				Size={UDim2.fromOffset(20, 20)}
				Image={props.Icon}
				ImageColor3={props.Color}
				ImageTransparency={props.Transparency}
				ScaleType={Enum.ScaleType.Fit}
			/>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0, 25)}
			/>
		</textbutton>
	);
}

export default NavFrameButton;
