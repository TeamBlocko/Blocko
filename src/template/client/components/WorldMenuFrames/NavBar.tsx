import Roact, { createBinding } from "@rbxts/roact";
import { SingleMotor, Spring } from "@rbxts/flipper";

interface NavBarPropTypes {
	Text: string;
	OnClick: (e: GuiButton) => void;
}

const SPRING_SETTINGS = {
	frequency: 4, // 4
	dampingRatio: 1, // 1
};

function NavBar(props: NavBarPropTypes) {
	const motor = new SingleMotor(0);
	const [binding, setBinding] = createBinding(motor.getValue());

	motor.onStep(setBinding);
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(126, 126, 126)}
			Position={UDim2.fromScale(0.5, 0)}
			Size={UDim2.fromOffset(300, 45)}
		>
			<screengui Key="ReturnToNav" />
			<imagebutton
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(25, 25)}
				Image="rbxassetid://3926307971"
				ImageTransparency={binding.map((value) => value)}
				ImageRectOffset={new Vector2(124, 324)}
				ImageRectSize={new Vector2(36, 36)}
				Event={{
					MouseEnter: () => motor.setGoal(new Spring(0.5, SPRING_SETTINGS)),
					MouseLeave: () => motor.setGoal(new Spring(0, SPRING_SETTINGS)),
					Activated: (e) => props.OnClick(e.Parent as GuiButton),
				}}
			/>
			<textlabel
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.8, 0.9)}
				Text={props.Text}
				Font={Enum.Font.GothamSemibold}
				TextColor3={new Color3(1, 1, 1)}
				TextSize={18}
				TextTransparency={0.05}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0, 10)}
			/>
		</frame>
	);
}

export default NavBar;
