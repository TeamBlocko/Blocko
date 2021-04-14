import Roact from "@rbxts/roact";
import CloseButton from "template/client/components/misc/CloseButton";
import TitleText from "template/client/components/misc/TitleText";

interface TopFramePropTypes {
	Text: string;
	OnClose: (inputButton: ImageButton) => void;
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
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<TitleText Text={props.Text} Size={UDim2.fromOffset(180, 14)} />
			<CloseButton OnClose={(inputButton: ImageButton) => props.OnClose(inputButton)} />
		</frame>
	);
}

export default TopFrame;
