import Roact from "@rbxts/roact";
import Flipper from "@rbxts/flipper";
import WorldCover from "./WorldCover";
import WorldInfo from "./WorldInfo";
import { popupFrameContext } from "../WorldsMenu/popupFramesContext";

class WorldFrame extends Roact.Component<World> {
	binding: Roact.Binding<number>;
	setBinding: Roact.BindingFunction<number>;

	motor: Flipper.SingleMotor;

	constructor(props: World) {
		super(props);

		[this.binding, this.setBinding] = Roact.createBinding(1);

		this.motor = new Flipper.SingleMotor(this.binding.getValue());

		this.motor.onStep(this.setBinding);
	}

	render() {
		return (
			<popupFrameContext.Consumer
				render={(value) => (
					<imagebutton
						BackgroundTransparency={1}
						Selectable={false}
						Size={UDim2.fromOffset(100, 100)}
						AutoButtonColor={false}
						Image={this.props.Settings.Icon}
						ScaleType={Enum.ScaleType.Crop}
						Event={{
							Activated: () => value.changePopup({ name: "World", id: this.props.Info.WorldId }),
							MouseEnter: () => this.motor.setGoal(new Flipper.Spring(0)),
							MouseLeave: () => this.motor.setGoal(new Flipper.Spring(1)),
						}}
					>
						<uiscale />
						<uiaspectratioconstraint AspectRatio={1.5527461767197} />
						<WorldInfo World={this.props} Transparency={this.binding} />
						<imagelabel
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(1, 1)}
							Image={"rbxassetid://6406939496"}
							ImageColor3={new Color3()}
							ImageTransparency={this.binding.map((value) => value * 0.2)}
							ZIndex={0}
						>
							<uicorner CornerRadius={new UDim(0.08, 0)} />
						</imagelabel>
						<WorldCover
							Image={"rbxassetid://3926305904"}
							ImageRectOffset={new Vector2(764, 844)}
							ImageRectSize={new Vector2(36, 36)}
							ImageTransparency={1}
						/>
						<WorldCover
							Image={"rbxassetid://3926305904"}
							ImageRectOffset={new Vector2(4, 684)}
							ImageRectSize={new Vector2(36, 36)}
							ImageTransparency={1 /* 0.1 */}
						/>
						<uicorner CornerRadius={new UDim(0.08, 0)} />
					</imagebutton>
				)}
			/>
		);
	}
}

export default WorldFrame;
