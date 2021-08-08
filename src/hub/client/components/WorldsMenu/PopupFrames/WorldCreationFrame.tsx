import Roact from "@rbxts/roact";
import Flipper from "@rbxts/flipper";
import CreationFramePages from "./CreationFramePages";

interface BottomFramePropTypes {
	Progress: Roact.Binding<number>;
}

function BottomFrame(props: BottomFramePropTypes) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 1)}
			BackgroundColor3={Color3.fromRGB(20, 20, 20)}
			Position={UDim2.fromScale(0.5, 1)}
			Size={UDim2.fromScale(1, 0.175)}
		>
			<frame
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={Color3.fromRGB(20, 20, 20)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(1, 0.25)}
			/>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<frame
				BackgroundColor3={Color3.fromRGB(83, 178, 255)}
				BorderSizePixel={0}
				Size={props.Progress.map((value) => UDim2.fromScale(value, 0.025))}
			/>
		</frame>
	);
}

class WorldCreationFrame extends Roact.Component {
	binding: Roact.Binding<number>;
	setBinding: Roact.BindingFunction<number>;

	motor: Flipper.SingleMotor;

	constructor() {
		super({});

		[this.binding, this.setBinding] = Roact.createBinding(0);

		this.motor = new Flipper.SingleMotor(this.binding.getValue());
		this.motor.onStep(this.setBinding);
	}

	render() {
		return (
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(30, 30, 30)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.35, 0.6)}
			>
				<imagelabel
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundColor3={Color3.fromRGB(40, 40, 40)}
					Position={UDim2.fromScale(0.5, 0)}
					Size={UDim2.fromScale(1, 1)}
					ImageTransparency={1}
					ScaleType={Enum.ScaleType.Crop}
				>
					<uicorner CornerRadius={new UDim(0.035, 0)} />
				</imagelabel>
				<imagelabel
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.55)}
					Size={UDim2.fromScale(1.1, 1.15)}
					Image={"rbxassetid://6408795655"}
					ImageColor3={new Color3()}
					ImageTransparency={0.5}
					ZIndex={0}
				/>
				<CreationFramePages Progress={this.motor} />
				<BottomFrame Progress={this.binding} />
				<uicorner CornerRadius={new UDim(0.035, 0)} />
				<uiaspectratioconstraint />
			</frame>
		);
	}
}

export default WorldCreationFrame;
