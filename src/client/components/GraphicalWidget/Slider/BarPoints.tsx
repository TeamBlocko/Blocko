import Roact from "@rbxts/roact";
import SliderNumber from "./SliderNumber";

interface BarPointsSliderNumber {
	Position: UDim2;
	Value: number;
	RefValue?: Roact.Ref<Frame>;
}

function BarPoints(props: BarPointsSliderNumber) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(203, 203, 203)}
			Position={props.Position}
			Size={UDim2.fromOffset(4, 12)}
			Ref={props.RefValue}
		>
			<uicorner />
			<SliderNumber Value={props.Value} SizeOffsetY={10} />
		</frame>
	);
}

export default BarPoints;
