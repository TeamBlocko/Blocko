import Roact from "@rbxts/roact";

interface CrosshairPropsType {
	Manager: ColorPickerManager;
}

function Crosshair(props: CrosshairPropsType) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={new Color3(1, 1, 1)}
			Size={UDim2.fromOffset(10, 10)}
			ZIndex={2}
			Ref={(e) => {
				if (e === undefined) return;
				e.Position = props.Manager.getHSFramePosition(e.Parent as GuiObject);
			}}
		>
			<uicorner CornerRadius={new UDim(1, 1)} />
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={props.Manager.state.Value}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromOffset(6, 6)}
			>
				<uicorner CornerRadius={new UDim(1, 1)} />
			</frame>
		</frame>
	);
}

export default Crosshair;
