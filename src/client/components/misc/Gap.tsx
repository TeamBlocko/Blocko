import Roact from "@rbxts/roact";

interface GapPropTypes {
	Length: number;
}

function Gap(props: GapPropTypes) {
	return <frame BackgroundTransparency={1} Size={UDim2.fromOffset(0, props.Length)} />;
}

export default Gap;
