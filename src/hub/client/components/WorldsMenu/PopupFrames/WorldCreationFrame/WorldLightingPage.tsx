import Roact from "@rbxts/roact";
import Flipper from "@rbxts/flipper";
import BottomFrame from "./BottomFrame";
import TopFrame from "./TopFrame";

interface WorldInfoPagePropTypes {
	FrameRef: Roact.Ref<Frame>;
	OnNext: () => void;
	OnUpdate: (value: Enum.Technology) => void;
	OnReturn: () => void;
	Selected: Enum.Technology;
}

interface MiddleFramePropTypes {
	OnUpdate: (value: Enum.Technology) => void;
	Selected: Enum.Technology;
}

interface LightingButtonPropTypes {
	Selected?: boolean;
	Image: string;
	OnClick: () => void;
}

class LightingButton extends Roact.Component<LightingButtonPropTypes> {
	binding: Roact.Binding<number>;
	setBinding: Roact.BindingFunction<number>;

	motor: Flipper.SingleMotor;

	constructor(props: LightingButtonPropTypes) {
		super(props);

		[this.binding, this.setBinding] = Roact.createBinding(props.Selected ? 1 : 0);
		this.motor = new Flipper.SingleMotor(this.binding.getValue());
		this.motor.onStep(this.setBinding);
	}

	render() {
		return (
			<imagebutton
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={0.975}
				Size={UDim2.fromScale(0.25, 1)}
				Image={this.props.Image}
				ScaleType={Enum.ScaleType.Crop}
				Event={{
					Activated: () => this.props.OnClick(),
				}}
			>
				<imagelabel
					AnchorPoint={new Vector2(0, 1)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0, 1)}
					Size={UDim2.fromScale(1, 0.45)}
					Image={"rbxassetid://6407293134"}
					ImageTransparency={this.binding.map((value) => 1 - value)}
					ImageColor3={Color3.fromRGB(69, 165, 255)}
				>
					<uicorner CornerRadius={new UDim(0.075, 0)} />
					<uistroke Color={Color3.fromRGB(254, 254, 254)} />
				</imagelabel>
				<uicorner CornerRadius={new UDim(0.075, 0)} />
				<uistroke Color={new Color3(1, 1, 1)} />
			</imagebutton>
		);
	}

	didUpdate() {
		this.motor.setGoal(new Flipper.Spring(this.props.Selected ? 1 : 0));
	}
}

const technologyIcons: { [K in Exclude<keyof typeof Enum.Technology, "GetEnumItems">]: string } = {
	Compatibility: "rbxassetid://6848857684",
	Future: "rbxassetid://6848857684",
	ShadowMap: "rbxassetid://6848861016",
	Voxel: "rbxassetid://6848859395",
	Legacy: "rbxassetid://0",
};

function MiddleFrame(props: MiddleFramePropTypes) {
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
			{[
				Enum.Technology.Compatibility,
				Enum.Technology.Voxel,
				Enum.Technology.ShadowMap,
				Enum.Technology.Future,
			].map((technology) => (
				<LightingButton
					Image={technologyIcons[technology.Name]}
					OnClick={() => props.OnUpdate(technology)}
					Selected={technology === props.Selected}
				/>
			))}
		</frame>
	);
}

/*
	Compability
	Future
	ShadowMap
	Voxel
*/

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
			<TopFrame
				Title={"World Lighting"}
				Description={"Please choose a lighting technology."}
				TitleSize={UDim2.fromScale(0.945, 0.275)}
				DescriptionSize={UDim2.fromScale(1, 0.177)}
			>
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
			<MiddleFrame OnUpdate={props.OnUpdate} Selected={props.Selected} />
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
