import Roact from "@rbxts/roact";
import CloseButton from "client/components/misc/CloseButton";
import TitleText from "client/components/misc/TitleText";

interface TopFramePropTypes {
	Text: string;
}

function TopFrame(props: TopFramePropTypes) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundTransparency={1}
			BorderColor3={new Color3()}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0.5, 0.025)}
			Size={new UDim2(0.95, 0, 0, 25)}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<TitleText Text={props.Text} PosScaleY={0} SizeOffsetX={180} />
			<CloseButton />
		</frame>
	);
}

export default TopFrame;