import Roact, { createBinding } from "@rbxts/roact";
import { SingleMotor, Spring } from "@rbxts/flipper";

interface NavFrameButtonPropTypes {
	Text: string;
	Icon: string;
	Color: Color3;
	OnClick: (e: GuiButton) => void;
}

const SPRING_SETTINGS = {
	frequency: 4, // 4
	dampingRatio: 1, // 1
};

function NavFrameButton(props: NavFrameButtonPropTypes) {
	const motor = new SingleMotor(0.5);
	const [binding, setBinding] = createBinding(motor.getValue());

	motor.onStep(setBinding);

	return (
		<textbutton
			BackgroundColor3={Color3.fromRGB(30, 30, 30)}
			BorderSizePixel={0}
			Size={new UDim2(1, 0, 0, 60)}
			AutoButtonColor={false}
			Font={Enum.Font.SourceSans}
			Text="0"
			TextColor3={new Color3()}
			TextSize={1}
			Event={{
				MouseEnter: () => motor.setGoal(new Spring(0, SPRING_SETTINGS)),
				MouseLeave: () => motor.setGoal(new Spring(0.5, SPRING_SETTINGS)),
				Activated: (e) => props.OnClick(e),
			}}
		>
			<screengui Key={props.Text} />
			<imagelabel
				BackgroundTransparency={1}
				Position={UDim2.fromScale(-0.4, 0.6)}
				Size={UDim2.fromOffset(20, 20)}
				Image={props.Icon}
				ImageColor3={props.Color}
				ImageTransparency={binding.map((value) => value)}
				ScaleType={Enum.ScaleType.Fit}
			/>
			<textlabel
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(185, 25)}
				Font={Enum.Font.Gotham}
				Text={props.Text}
				TextColor3={props.Color}
				TextSize={18}
				TextTransparency={binding.map((value) => value)}
				TextXAlignment={Enum.TextXAlignment.Right}
			/>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0, 25)}
			/>
		</textbutton>
	);
}

export default NavFrameButton;
