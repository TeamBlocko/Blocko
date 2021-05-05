import { UserInputService, ReplicatedStorage } from "@rbxts/services";
import Roact, { Component, createRef, createBinding, RoactBinding, RoactBindingFunc } from "@rbxts/roact";
import { SingleMotor, Spring } from "@rbxts/flipper";
import NavigationFrame from "./WorldMenuFrames/NavigationFrame";
import WorldInfoFrame from "./WorldMenuFrames/WorldInfoFrame";
import SettingsFrame from "./WorldMenuFrames/SettingsFrame";
import Permissions from "./WorldMenuFrames/Permissions";

const [VERSION] = ReplicatedStorage.TS.version.Value.match("%S+");

class WorldMenu extends Component {
	private uiPagelayoutRef: Roact.Ref<UIPageLayout>;
	private navigationFrameRef: Roact.Ref<Frame>;
	private worldInfoFrameRef: Roact.Ref<Frame>;
	private worldSettingsFrameRef: Roact.Ref<Frame>;
	private permissionsFrameRef: Roact.Ref<Frame>;

	private motor: SingleMotor;
	private binding: RoactBinding<number>;
	private setBinding: RoactBindingFunc<number>;

	constructor() {
		super({});
		this.uiPagelayoutRef = createRef();
		this.navigationFrameRef = createRef();
		this.worldInfoFrameRef = createRef();
		this.worldSettingsFrameRef = createRef();
		this.permissionsFrameRef = createRef();

		this.motor = new SingleMotor(0);
		[this.binding, this.setBinding] = createBinding(this.motor.getValue());

		this.motor.onStep(this.setBinding);
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
			case "Permissions":
				const permissions = this.permissionsFrameRef.getValue();
				if (permissions === undefined) return;
				uiPagelayout.JumpTo(permissions);
				break;
			case "ReturnToNav":
				const navFrame = this.navigationFrameRef.getValue();
				if (navFrame === undefined) return;
				uiPagelayout.JumpTo(navFrame);
				break;
		}
	}

	didMount() {
		UserInputService.InputBegan.Connect((input, gameProcessed) => {
			if (gameProcessed) return;
			if (input.KeyCode === Enum.KeyCode.V) this.motor.setGoal(new Spring(this.motor.getValue() === 0 ? 1 : 0));
		});
	}

	render() {
		return (
			<frame
				AnchorPoint={this.binding.map((value) => new Vector2(0, 0).Lerp(new Vector2(1, 0), value))}
				BackgroundColor3={Color3.fromRGB(30, 30, 30)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(1, 0)}
				Size={new UDim2(0, 300, 1, 0)}
			>
				<textlabel
					AnchorPoint={new Vector2(0, 1)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0, 1)}
					Size={new UDim2(1, 0, 0, 10)}
					Font={Enum.Font.SourceSans}
					Text={tostring(VERSION)}
					TextColor3={new Color3(1, 1, 1)}
					TextSize={14}
					TextXAlignment={Enum.TextXAlignment.Right}
					ZIndex={2}
				/>
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
					<Permissions RefValue={this.permissionsFrameRef} OnClick={(e) => this.onNavFrameButtonClick(e)} />
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
