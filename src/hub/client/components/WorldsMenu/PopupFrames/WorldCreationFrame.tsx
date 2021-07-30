import Roact from "@rbxts/roact";
import CreationFramePages from "./CreationFramePages";

function BottomFrame() {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 1)}
			BackgroundColor3={Color3.fromRGB(30, 30, 30)}
			Position={UDim2.fromScale(1, 0.175)}
		>
			<frame
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={Color3.fromRGB(29, 29, 29)}
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(1, 0.25)}
			/>
			<uicorner CornerRadius={new UDim(0.2, 0)} />
			<frame BackgroundColor3={Color3.fromRGB(83, 178, 255)} Size={UDim2.fromScale(0, 0.025)} />
		</frame>
	);
}

function WorldCreationFrame() {
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
			/>
			<CreationFramePages />
			<BottomFrame />
			<uicorner CornerRadius={new UDim(0.035, 0)} />
			<uiaspectratioconstraint />
		</frame>
	);
}

export default WorldCreationFrame;
