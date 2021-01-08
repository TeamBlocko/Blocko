import Roact, { Component, createRef } from "@rbxts/roact";
import NavigationFrame from "./WorldMenuFrames/NavigationFrame";
import WorldInfoFrame from "./WorldMenuFrames/WorldInfoFrame";
import SettingsFrame from "./WorldMenuFrames/SettingsFrame";

class WorldMenu extends Component {
	uiPagelayoutRef: Roact.Ref<UIPageLayout>;
	navigationFrameRef: Roact.Ref<Frame>;
	worldInfoFrameRef: Roact.Ref<Frame>;
	worldSettingsFrameRef: Roact.Ref<Frame>;

	constructor() {
		super({});
		this.uiPagelayoutRef = createRef();
		this.navigationFrameRef = createRef();
		this.worldInfoFrameRef = createRef();
		this.worldSettingsFrameRef = createRef();
	}

	onNavFrameButtonClick(e: GuiObject) {
		const uiPagelayout = this.uiPagelayoutRef.getValue();
		if (uiPagelayout === undefined) return;
		switch ((e.FindFirstChildOfClass("ScreenGui") as ScreenGui).Name) {
			case "World Info":
				const worldInfo = this.worldInfoFrameRef.getValue();
				if (worldInfo === undefined) return;
				uiPagelayout.JumpTo(worldInfo);
				break;
			case "World Settings":
				const worldSettings = this.worldSettingsFrameRef.getValue();
				if (worldSettings === undefined) return;
				uiPagelayout.JumpTo(worldSettings);
				break;
			case "ReturnToNav":
				const navFrame = this.navigationFrameRef.getValue();
				if (navFrame === undefined) return;
				uiPagelayout.JumpTo(navFrame);
				break;
		}
	}

	render() {
		return (
			<frame
				AnchorPoint={new Vector2(1, 0)}
				BackgroundColor3={Color3.fromRGB(30, 30, 30)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(1, 0)}
				Size={new UDim2(0, 300, 1, 0)}
			>
				<scrollingframe
					AnchorPoint={new Vector2(0.5, 1)}
					BackgroundColor3={Color3.fromRGB(30, 30, 30)}
					BorderSizePixel={0}
					CanvasSize={new UDim2()}
					Position={UDim2.fromScale(0.5, 1)}
					Selectable={false}
					Size={UDim2.fromScale(1, 1)}
					ScrollBarImageColor3={Color3.fromRGB(91, 91, 91)}
					ScrollBarImageTransparency={1}
					ScrollBarThickness={0}
					ScrollingEnabled={false}
					VerticalScrollBarInset={Enum.ScrollBarInset.ScrollBar}
				>
					<uipagelayout
						Ref={this.uiPagelayoutRef}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						Circular={true}
						EasingStyle={Enum.EasingStyle.Quint}
						GamepadInputEnabled={false}
						ScrollWheelInputEnabled={false}
						TouchInputEnabled={false}
						TweenTime={0.5}
					/>
					<NavigationFrame
						RefValue={this.navigationFrameRef}
						OnClick={(e) => this.onNavFrameButtonClick(e)}
					/>
					<WorldInfoFrame RefValue={this.worldInfoFrameRef} OnClick={(e) => this.onNavFrameButtonClick(e)} />
					<SettingsFrame
						RefValue={this.worldSettingsFrameRef}
						OnClick={(e) => this.onNavFrameButtonClick(e)}
					/>
				</scrollingframe>
				<imagelabel
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundColor3={new Color3(1, 1, 1)}
					BackgroundTransparency={1}
					Position={new UDim2(0, -25, 0.5, 0)}
					Size={new UDim2(0, 95, 2, 0)}
					ZIndex={0}
					Image={"rbxgameasset://Images/Rectangle 23"}
					ImageColor3={Color3.fromRGB(30, 30, 30)}
					ImageTransparency={0.1}
				/>
			</frame>
		);
	}
}

export default WorldMenu;
