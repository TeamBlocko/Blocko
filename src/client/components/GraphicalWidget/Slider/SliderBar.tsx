import Roact from "@rbxts/roact";
import BarPoints from "./BarPoints";
import SliderNumber from "./SliderNumber";
import { map } from "shared/module";

interface MinMax {
	Value: number;
	Ref: Roact.Ref<Frame>;
}

interface SliderBar {
	Min: MinMax;
	Max: MinMax;
	Value: number;
	HandleInput: (element: TextButton, InputObject: InputObject) => void;
}

function SliderBar(props: SliderBar) {
	const XPositionScale = map(props.Value, props.Min.Value, props.Max.Value, 0, 1);

	return (
		<textbutton
			Key="BackGreyFill"
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={new Color3(1, 1, 1)}
			BackgroundTransparency={0.5}
			Position={UDim2.fromScale(0.5, 0.75)}
			Size={new UDim2(0.9, 0, 0, 3)}
			Text=""
			Event={{
				InputBegan: (element, input) => props.HandleInput(element, input),
				InputEnded: (element, input) => props.HandleInput(element, input),
			}}
		>
			<uicorner />
			<textbutton
				Key="Slider"
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(89, 161, 255)}
				Position={UDim2.fromScale(XPositionScale, 0.5)}
				Text=""
				Size={UDim2.fromOffset(7, 15)}
				Event={{
					InputBegan: (element, input) => props.HandleInput(element, input),
					InputEnded: (element, input) => props.HandleInput(element, input),
				}}
			>
				<uicorner />
				<SliderNumber Value={math.floor(props.Value)} SizeOffsetY={12} />
			</textbutton>

			<BarPoints RefValue={props.Max.Ref} Position={UDim2.fromScale(1, 0.5)} Value={props.Max.Value} />
			<BarPoints Position={UDim2.fromScale(0.5, 0.5)} Value={props.Max.Value / 2} />
			<BarPoints RefValue={props.Min.Ref} Position={UDim2.fromScale(0, 0.5)} Value={props.Min.Value} />
			<textbutton
				Key="BlueFill"
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundColor3={Color3.fromRGB(66, 126, 193)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0, 0.5)}
				Size={UDim2.fromScale(XPositionScale, 1)}
				ZIndex={0}
				Text=""
				Event={{
					InputBegan: (element, input) => props.HandleInput(element, input),
					InputEnded: (element, input) => props.HandleInput(element, input),
				}}
			/>
		</textbutton>
	);
}

export default SliderBar;
