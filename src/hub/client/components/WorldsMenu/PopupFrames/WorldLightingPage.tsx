import Roact from "@rbxts/roact";
import BottomFrame from "./BottomFrame";
import TopFrame from "./TopFrame";

interface WorldInfoPagePropTypes {
	FrameRef: Roact.Ref<Frame>;
	OnNext: () => void;
	OnReturn: () => void;
}

interface LightingButtonPropTypes {
	Selected?: boolean;
	Image: string;
}

function LightingButton(props: LightingButtonPropTypes) {
	return (
		<imagebutton
			BackgroundColor3={new Color3(1, 1, 1)}
			BackgroundTransparency={0.975}
			Size={UDim2.fromScale(0.25, 1)}
			Image={props.Image}
			ScaleType={Enum.ScaleType.Crop}
		>
			{props.Selected ? (
				<imagelabel
					AnchorPoint={new Vector2(0, 1)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0, 1)}
					Size={UDim2.fromScale(1, 0.45)}
					Image={"rbxassetid://6407293134"}
					ImageColor3={Color3.fromRGB(69, 165, 255)}
				>
					<uistroke Color={Color3.fromRGB(254, 254, 254)} />
				</imagelabel>
			) : undefined}
			<uicorner CornerRadius={new UDim(0.075, 0)} />
			<uistroke Color={new Color3(1, 1, 1)} />
		</imagebutton>
	);
}

function MiddleFrame() {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.55)}
			Size={UDim2.fromScale(0.85, 0.45)}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				Padding={new UDim(0.015)}
			/>
			<LightingButton Image={"rbxassetid://6848857684"} />
			<LightingButton Image={"rbxassetid://6848862411"} />
			<LightingButton Image={"rbxassetid://6848857684"} />
			<LightingButton Image={"rbxassetid://6407293134"} />
		</frame>
	);
}

function WorldLightingPage(props: WorldInfoPagePropTypes) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			ClipsDescendants={true}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			Ref={props.FrameRef}
		>
			<TopFrame Title={"World Lighting"} Description={"Please choose a lighting technology."}>
				<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 0.3)}>
					<imagelabel
						BackgroundTransparency={1}
						Size={UDim2.fromScale(0.6, 0.6)}
						Image={"rbxassetid://3926305904"}
						ImageColor3={Color3.fromRGB(255, 87, 87)}
						ImageRectOffset={new Vector2(364, 324)}
						ImageRectSize={new Vector2(36, 36)}
					>
						<uiaspectratioconstraint />
					</imagelabel>
					<textlabel
						BackgroundTransparency={1}
						Size={UDim2.fromScale(0.85, 0.77)}
						Font={Enum.Font.GothamSemibold}
						Text={"You can’t change this later due to Roblox limitations"}
						TextColor3={Color3.fromRGB(255, 87, 87)}
						TextScaled={true}
						TextSize={11}
						TextWrapped={true}
						TextXAlignment={Enum.TextXAlignment.Left}
					/>
					<uicorner CornerRadius={new UDim(0.15)} />
					<uistroke Color={Color3.fromRGB(255, 87, 87)} Thickness={0.75} />
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						Padding={new UDim(0.025)}
					/>
				</frame>
			</TopFrame>
			<MiddleFrame />
			<BottomFrame
				Button1Click={() => props.OnReturn()}
				Button1Text={"Return"}
				Button2Click={() => props.OnNext()}
				Button2Text={"Next"}
			/>
		</frame>
	);
}

export default WorldLightingPage;
