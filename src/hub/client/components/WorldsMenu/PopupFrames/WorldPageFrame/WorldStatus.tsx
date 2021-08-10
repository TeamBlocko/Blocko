import Roact from "@rbxts/roact";

interface WorldStatusPropTypes {
	Image: string;
	ImageRectOffset: Vector2;
	Text: string;
	Visible: boolean;
}

export function WorldStatus(props: WorldStatusPropTypes) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={0.25}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			Visible={props.Visible}
		>
			<uicorner CornerRadius={new UDim(0.35, 0)} />
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.1, 0.1)}
				Image={props.Image}
				ImageRectOffset={props.ImageRectOffset}
				ImageRectSize={new Vector2(36, 36)}
				ScaleType={Enum.ScaleType.Fit}
			>
				<uiaspectratioconstraint />
			</imagelabel>
			<textlabel
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.3, 0.1)}
				Font={Enum.Font.GothamSemibold}
				RichText={true}
				Text={props.Text}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
				TextSize={14}
				TextWrapped={true}
			/>
			<uilistlayout
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0.025, 0)}
			/>
		</frame>
	);
}
