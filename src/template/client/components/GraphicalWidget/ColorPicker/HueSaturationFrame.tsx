import Roact from "@rbxts/roact";
import Crosshair from "./Crosshair";

interface HSFramePropTypes {
	RefValue: Roact.Ref<ImageButton>;
	Manager: ColorPickerManager;
}

function HueSaturationFrame(props: HSFramePropTypes) {
	return (
		<imagebutton
			Ref={props.RefValue}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			BorderColor3={new Color3()}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromOffset(225, 220)}
			Image="http://www.roblox.com/asset/?id=181615068"
			Event={{
				InputBegan: (_, inputObject) => props.Manager.HandleInput(inputObject),
				InputEnded: (_, inputObject) => props.Manager.HandleInput(inputObject),
				InputChanged: (_, inputObject) => props.Manager.HandleInput(inputObject),
			}}
		>
			<Crosshair Manager={props.Manager} />
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={props.Manager.cvalue}
				BackgroundColor3={new Color3()}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Image="rbxassetid://5690021401"
			/>
		</imagebutton>
	);
}

export default HueSaturationFrame;
