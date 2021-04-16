import Roact from "@rbxts/roact";

interface GapPropTypes {
	Length?: number;
	Width?: number;
	LayoutOrder?: number;
}

function Gap(props: GapPropTypes) {
	return (
		<frame
			BackgroundTransparency={1}
			Size={UDim2.fromOffset(props.Width, props.Length)}
			LayoutOrder={props.LayoutOrder}
		/>
	);
}

export default Gap;
