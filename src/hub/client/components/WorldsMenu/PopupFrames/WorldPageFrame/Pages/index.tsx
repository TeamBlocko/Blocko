import Roact from "@rbxts/roact";
import { MainPage } from "./MainPage";

export function Pages(props: { World: World }) {
	return (
		<frame
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(27, 42, 53)}
			ClipsDescendants={true}
			Size={UDim2.fromScale(1, 1)}
		>
			<MainPage World={props.World} />
			<uipagelayout
				FillDirection={Enum.FillDirection.Vertical}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				EasingStyle={Enum.EasingStyle.Quint}
				TweenTime={0.5}
			/>
		</frame>
	);
}
