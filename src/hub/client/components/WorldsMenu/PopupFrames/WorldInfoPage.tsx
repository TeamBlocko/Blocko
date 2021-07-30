import Roact from "@rbxts/roact";
import BottomFrame from "./BottomFrame";
import TopFrame from "./TopFrame";

interface WorldInfoPagePropTypes {
	FrameRef: Roact.Ref<Frame>;
	OnNext: () => void;
	OnReturn: () => void;
}

function MidFrame() {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.535)}
			Size={UDim2.fromScale(0.85, 0.5)}
		>
			<textbox
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 0.09)}
				Font={Enum.Font.Gotham}
				MaxVisibleGraphemes={40}
				PlaceholderColor3={Color3.fromRGB(178, 178, 178)}
				PlaceholderText="Name"
				Text={""}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
				TextSize={14}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<frame
					AnchorPoint={new Vector2(0, 1)}
					BackgroundColor3={Color3.fromRGB(178, 178, 178)}
					Position={new UDim2(0, 0, 1, 5)}
					Size={new UDim2(1, 0, 0, 1)}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
					<frame BackgroundColor3={Color3.fromRGB(68, 161, 248)} Size={UDim2.fromScale(0, 1)} />
				</frame>
			</textbox>
			<textbox
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 0.09)}
				Font={Enum.Font.Gotham}
				MaxVisibleGraphemes={40}
				PlaceholderColor3={Color3.fromRGB(178, 178, 178)}
				PlaceholderText="Description"
				Text={""}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
				TextSize={14}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<frame
					AnchorPoint={new Vector2(0, 1)}
					BackgroundColor3={Color3.fromRGB(178, 178, 178)}
					Position={new UDim2(0, 0, 1, 5)}
					Size={new UDim2(1, 0, 0, 1)}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
					<frame BackgroundColor3={Color3.fromRGB(68, 161, 248)} Size={UDim2.fromScale(0, 1)} />
				</frame>
			</textbox>
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0.125)} />
		</frame>
	);
}

function WorldInfoPage(props: WorldInfoPagePropTypes) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			ClipsDescendants={true}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			Ref={props.FrameRef}
		>
			<TopFrame
				Title={"Edit Info"}
				Description={"Set a name and a description for your world, you can always change it later!"}
			/>
			<MidFrame />
			<BottomFrame
				Button1Click={() => props.OnReturn()}
				Button1Text={"Return"}
				Button2Click={() => props.OnNext()}
				Button2Text={"Next"}
			/>
		</frame>
	);
}

export default WorldInfoPage;
