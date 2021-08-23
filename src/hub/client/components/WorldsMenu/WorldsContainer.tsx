import { Workspace } from "@rbxts/services";
import Roact from "@rbxts/roact";
import Flipper from "@rbxts/flipper";
import { Client } from "@rbxts/net";
import { FilterItem, searchContext } from "hub/client/searchContext";
import WorldFrame from "../WorldFrame";
import { popupFrameContext } from "./popupFramesContext";
import { worldCache } from "hub/client/cache";

const camera = Workspace.CurrentCamera as Camera;

const fetchWorlds = Client.GetAsyncFunction<[], [Filter], FetchWorldsResult>("FetchWorlds");
const fetchWorldInfo = Client.GetAsyncFunction<[], [number], World>("FetchWorldInfo");

fetchWorlds.SetCallTimeout(100);
fetchWorldInfo.SetCallTimeout(100);

class CreateWorld extends Roact.Component {
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
				render={(value) => {
					return (
						<imagebutton
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundColor3={this.binding.map((value) =>
								Color3.fromRGB(30, 30, 30).Lerp(Color3.fromRGB(72, 178, 255), value),
							)}
							BackgroundTransparency={this.binding.map((value) => (1 - value) * 0.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							AutoButtonColor={false}
							ScaleType={Enum.ScaleType.Crop}
							Event={{
								Activated: () => value.changePopup({ name: "Create", id: 0 }),
								MouseEnter: () => this.motor.setGoal(new Flipper.Spring(1)),
								MouseLeave: () => this.motor.setGoal(new Flipper.Spring(0)),
							}}
						>
							<uiscale />
							<uiaspectratioconstraint AspectRatio={1.5527461767197} />
							<uicorner CornerRadius={new UDim(0.08, 0)} />
							<imagebutton
								AnchorPoint={new Vector2(0.5, 0.5)}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.5, 0.5)}
								Size={UDim2.fromScale(0.3, 0.3)}
								Image={"rbxassetid://3926307971"}
								ImageRectOffset={new Vector2(324, 364)}
								ImageRectSize={new Vector2(36, 36)}
							>
								<uiaspectratioconstraint />
							</imagebutton>
						</imagebutton>
					);
				}}
			/>
		);
	}
}

function Error(props: { Error: string }) {
	return (
		<frame BackgroundTransparency={1} Size={new UDim2(1, 0, 0, 175)}>
			<uicorner CornerRadius={new UDim(0.05, 0)} />
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 10)} />
			<textlabel
				AutomaticSize={Enum.AutomaticSize.XY}
				BackgroundTransparency={1}
				Size={new UDim2(1, 0, 0, 50)}
				Font={Enum.Font.Gotham}
				RichText={true}
				Text={props.Error}
				TextColor3={new Color3(1, 1, 1)}
				TextSize={20}
				TextTransparency={0.1}
				TextYAlignment={Enum.TextYAlignment.Top}
			/>
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.4)}
				Size={UDim2.fromOffset(130, 130)}
			/>
		</frame>
	);
}

interface WorldsState {
	Error?: string;
	Worlds?: World[];
	Loaded: boolean;
}

function renderWorlds(worlds: World[]): Roact.Element[] {
	return worlds.map((world) => {
		worldCache.set(world.Info.WorldId, world);
		return <WorldFrame Info={world.Info} Settings={world.Settings} />;
	});
}

interface WorldsContainerPropTypes {
	Filter: FilterItem;
}

class WorldsContainer extends Roact.Component<WorldsContainerPropTypes, WorldsState> {
	canvasSizeBinding: Roact.Binding<number>;
	setCanvasSizeBinding: Roact.BindingFunction<number>;

	constructor(props: WorldsContainerPropTypes) {
		super(props);

		[this.canvasSizeBinding, this.setCanvasSizeBinding] = Roact.createBinding(0);

		this.setState({
			Worlds: [],
		});
	}

	async fetchWorlds(filter: Filter) {
		if (!this.state.Loaded) {
			const result = await fetchWorlds.CallServerAsync(filter);
			if (result.success) {
				const worldsInfo = result.data.map((worldId) => fetchWorldInfo.CallServerAsync(worldId));
				if (worldsInfo.size() === 0) {
					this.setState({
						Error: `<b><font size='20'>UH OH!</font></b> \n Looks like there are no ${filter} worlds to check out right now.`,
						Worlds: Roact.None,
						Loaded: true,
					});
				} else {
					this.setState({
						Worlds: await Promise.all<typeof worldsInfo>(worldsInfo),
						Error: Roact.None,
						Loaded: true,
					});
				}
			} else {
				this.setState({
					Error: result.error,
					Worlds: Roact.None,
					Loaded: true,
				});
			}
		}
	}

	shouldUpdate(nextProps: WorldsContainerPropTypes, nextState: WorldsState) {
		if (nextProps.Filter.Name !== this.props.Filter.Name) {
			(this.state as WorldsState).Error = undefined;
			(this.state as WorldsState).Worlds = [];
			(this.state as WorldsState).Loaded = false;
		}
		return !this.state.Loaded || !nextState.Loaded;
	}

	render() {
		const createWorld = this.props.Filter.Name !== "Owned" ? undefined : <CreateWorld />;
		const errorText = this.state.Error ? <Error Error={this.state.Error} /> : undefined;
		return (
			<scrollingframe
				AnchorPoint={new Vector2(0.5, 1)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				ClipsDescendants={false}
				Position={UDim2.fromScale(0.5, 1.4)}
				Size={UDim2.fromScale(0.985, 1)}
				ElasticBehavior={Enum.ElasticBehavior.Never}
				ScrollBarThickness={5}
				CanvasSize={this.canvasSizeBinding.map((value) => UDim2.fromOffset(0, value + 10))}
			>
				{createWorld ?? errorText}
				<uigridlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					CellPadding={camera.ViewportSize.X < 1400 ? UDim2.fromOffset(45, 45) : UDim2.fromOffset(50, 50)}
					CellSize={camera.ViewportSize.X < 1400 ? UDim2.fromOffset(237, 153) : UDim2.fromOffset(356, 229)}
					Change={{
						AbsoluteContentSize: (e) => {
							print(e.AbsoluteContentSize.Y);
							this.setCanvasSizeBinding(e.AbsoluteContentSize.Y);
						},
					}}
				/>
				{!errorText ? renderWorlds(this.state.Worlds!) : undefined}
			</scrollingframe>
		);
	}

	async didMount() {
		this.fetchWorlds(this.props.Filter.Name);
	}

	async didUpdate() {
		this.fetchWorlds(this.props.Filter.Name);
	}
}

export default function () {
	return <searchContext.Consumer render={(value) => <WorldsContainer Filter={value.filter} />} />;
}
