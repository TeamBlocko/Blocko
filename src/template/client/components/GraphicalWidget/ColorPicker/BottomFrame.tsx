import Roact from "@rbxts/roact";
import ValueFrame from "./ValueFrame";
import PickColorButton from "./PickColorButton";

interface BottomFramePropTypes {
	RefValue: Roact.Ref<TextButton>;
	Manager: ColorPickerManager;
	UpdateColor: (color: Color3) => void;
	Id: string;
}

function BottomFrame(props: BottomFramePropTypes) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			BorderColor3={new Color3()}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0.5, 0.93)}
			Size={new UDim2(0.95, 0, 0, 25)}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0, 8)}
			/>
			<PickColorButton UpdateColor={props.UpdateColor} Id={props.Id} />
			<ValueFrame RefValue={props.RefValue} Manager={props.Manager} />
		</frame>
	);
}

export default BottomFrame;
