import Roact from "@rbxts/roact";
import Flipper from "@rbxts/flipper";
import { Client } from "@rbxts/net";
import { worldCache } from "hub/client/cache";
import { popupFrameContext } from "../../popupFramesContext";
import { Pages } from "./Pages";
import { WorldStatus } from "./WorldStatus";

const fetchWorldInfo = Client.GetAsyncFunction<[], [number], World>("FetchWorldInfo");

class Close extends Roact.Component {
	binding: Roact.Binding<number>;
	setBinding: Roact.BindingFunction<number>;

	motor: Flipper.SingleMotor;

	constructor() {
		super({});

		[this.binding, this.setBinding] = Roact.createBinding(0);

		this.motor = new Flipper.SingleMotor(this.binding.getValue());

		this.motor.onStep(this.setBinding);
	}

	render() {
		return (
			<popupFrameContext.Consumer
				render={(value) => (
					<imagebutton
						AnchorPoint={new Vector2(1, 0)}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.95, 0.075)}
						Size={UDim2.fromScale(0.075, 0.075)}
						Image={"rbxassetid://3926305904"}
						ImageRectOffset={new Vector2(284, 4)}
						ImageRectSize={new Vector2(24, 24)}
						ScaleType={Enum.ScaleType.Fit}
						ImageTransparency={this.binding.map((value) => value * 0.5)}
						Event={{
							Activated: () => value.changePopup(Roact.None),
							MouseEnter: () => this.motor.setGoal(new Flipper.Spring(1)),
							MouseLeave: () => this.motor.setGoal(new Flipper.Spring(0)),
						}}
					>
						<uiaspectratioconstraint />
					</imagebutton>
				)}
			/>
		);
	}
}

interface WorldPageFramePropTypes {
	Position: Roact.Binding<number>;
	World: World;
	Visible: boolean;
}

export function WorldPageFrame(props: WorldPageFramePropTypes) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(30, 30, 30)}
			Position={props.Position.map((value) => UDim2.fromScale(0.5, 0.45).Lerp(UDim2.fromScale(0.5, 0.5), value))}
			Size={UDim2.fromScale(0.6, 0.6)}
			Visible={props.Visible}
		>
			<uicorner CornerRadius={new UDim(0.035, 0)} />
			<WorldStatus
				Image={"rbxassetid://3926307971"}
				ImageRectOffset={new Vector2(564, 44)}
				Visible={false}
				Text={"This world is currently <b>under review.</b>"}
			/>
			<WorldStatus
				Image={"rbxassetid://3926305904"}
				ImageRectOffset={new Vector2(764, 844)}
				Visible={false}
				Text={"You are banned from this world"}
			/>
			<WorldStatus
				Image={"rbxassetid://3926307971"}
				ImageRectOffset={new Vector2(4, 684)}
				Visible={false}
				Text={"This world is currently <b>private.</b>"}
			/>
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={Color3.fromRGB(30, 30, 30)}
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(1, 1)}
				Image={props.World.Settings.Thumbnail}
				ImageTransparency={0.75}
				ScaleType={Enum.ScaleType.Crop}
			>
				<uicorner CornerRadius={new UDim(0.035, 0)} />
				<imagelabel
					AnchorPoint={new Vector2(0, 1)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0, 1)}
					Rotation={180}
					Size={UDim2.fromScale(1, 1)}
					Image={"rbxassetid://6407293134"}
					ImageColor3={Color3.fromRGB(30, 30, 30)}
				>
					<uicorner CornerRadius={new UDim(0.035, 0)} />
				</imagelabel>
			</imagelabel>
			<Close />
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.55)}
				Size={UDim2.fromScale(1.1, 1.15)}
				Image={"rbxassetid://6408795655"}
				ImageColor3={new Color3()}
				ImageTransparency={0.5}
				ZIndex={0}
			/>
			<Pages World={props.World} />
			<uiaspectratioconstraint AspectRatio={1.6399110555649} />
		</frame>
	);
}

interface WorldPageFrameRenderedPropTypes {
	Position: Roact.Binding<number>;
	WorldId: number;
	Visible: boolean;
}

export default class extends Roact.Component<WorldPageFrameRenderedPropTypes, { World?: World }> {
	render() {
		return (
			<popupFrameContext.Consumer
				render={() => (
					<>
						{this.state.World && (
							<WorldPageFrame
								Position={this.props.Position}
								World={this.state.World}
								Visible={this.props.Visible}
							/>
						)}
					</>
				)}
			/>
		);
	}

	async didMount() {
		this.setState({
			World: worldCache.get(this.props.WorldId) ?? (await this.getWorld()),
		});
	}

	shouldUpdate(nextProps: WorldPageFrameRenderedPropTypes, nextState: { World?: World }) {
		return (
			nextProps.WorldId !== this.props.WorldId ||
			nextProps.Visible !== this.props.Visible ||
			nextState.World !== this.state.World
		);
	}

	async getWorld() {
		const result = await fetchWorldInfo.CallServerAsync(this.props.WorldId);
		worldCache.set(this.props.WorldId, result);
		return result;
	}

	async didUpdate() {
		this.setState({
			World: worldCache.get(this.props.WorldId) ?? (await this.getWorld()),
		});
	}
}
