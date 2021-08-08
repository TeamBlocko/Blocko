import Roact from "@rbxts/roact";
import BarPoints from "./BarPoints";
import SliderInput from "./SliderInput";
import { map } from "common/shared/utility";

interface MinMax {
	Value: number;
	Ref: Roact.Ref<Frame>;
}

interface SliderBar {
	Min: MinMax;
	Max: MinMax;
	Value: number;
	Binding: Roact.Binding<number>;
	DeciminalPlace?: number;
	HandleInput: (element: TextButton, InputObject: InputObject) => void;
	OnTextChange: (text: TextBox) => void;
}

function SliderBar(props: SliderBar) {
	const XPositionScale = map(props.Value, props.Min.Value, props.Max.Value, 0, 1);

	return (
		<textbutton
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
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(89, 161, 255)}
				Position={UDim2.fromScale(XPositionScale, 0.5)}
				Text=""
				Size={UDim2.fromOffset(7, 15)}
				ZIndex={2}
				Event={{
					InputBegan: (element, input) => props.HandleInput(element, input),
					InputEnded: (element, input) => props.HandleInput(element, input),
				}}
			>
				<uicorner />
				<SliderInput
					Binding={props.Binding}
					Value={props.Value}
					DecimalPlace={props.DeciminalPlace}
					OnTextChange={(text) => props.OnTextChange(text)}
					Range={{ Min: props.Min.Value, Max: props.Max.Value }}
				/>
			</textbutton>

			<BarPoints RefValue={props.Max.Ref} Position={UDim2.fromScale(1, 0.5)} Value={props.Max.Value} />
			<BarPoints Position={UDim2.fromScale(0.5, 0.5)} Value={props.Max.Value / 2} />
			<BarPoints RefValue={props.Min.Ref} Position={UDim2.fromScale(0, 0.5)} Value={props.Min.Value} />
			<textbutton
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
