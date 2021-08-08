import Roact from "@rbxts/roact";
import Flipper from "@rbxts/flipper";
import { Client } from "@rbxts/net";
import WorldFinishPage from "./WorldFinishPage";
import WorldInfoPage from "./WorldInfoPage";
import WorldLightingPage from "./WorldLightingPage";
import WorldTemplatePage from "./WorldTemplatePage";
import notificationStore from "common/client/notificationStore";

const createWorld = Client.GetAsyncFunction<[], [CreationOptions], World | undefined>("CreateWorld");

createWorld.SetCallTimeout(100);

interface CreationFramePagesPropTypes {
	Progress: Flipper.SingleMotor;
}

let creating = false;

class CreationFramePages extends Roact.Component<CreationFramePagesPropTypes, CreationOptions> {
	worldtemplatePageRef: Roact.Ref<Frame>;
	worldinfoPageRef: Roact.Ref<Frame>;
	worldlightingPageRef: Roact.Ref<Frame>;
	worldfinishPageRef: Roact.Ref<Frame>;
	uipagelayoutRef: Roact.Ref<UIPageLayout>;

	constructor(props: CreationFramePagesPropTypes) {
		super(props);

		this.worldtemplatePageRef = Roact.createRef();
		this.worldinfoPageRef = Roact.createRef();
		this.worldlightingPageRef = Roact.createRef();
		this.worldfinishPageRef = Roact.createRef();
		this.uipagelayoutRef = Roact.createRef();

		this.setState({
			Template: "MiniBaseplate",
			Lighting: Enum.Technology.Future,
		});
	}

	changePage(page: Roact.Ref<Frame>) {
		const element = page.getValue();
		const uipagelayout = this.uipagelayoutRef.getValue();

		if (!element) return warn("No element");
		if (!uipagelayout) return warn("No uipagelayout");

		uipagelayout.JumpTo(element);
	}

	render() {
		return (
			<frame BackgroundTransparency={1} ClipsDescendants={true} Size={UDim2.fromScale(1, 1)} ZIndex={2}>
				<WorldTemplatePage
					FrameRef={this.worldtemplatePageRef}
					OnNext={() => {
						this.changePage(this.worldinfoPageRef);
						this.props.Progress.setGoal(new Flipper.Spring(1 / 3));
					}}
				/>
				<WorldInfoPage
					OnNext={() => {
						this.changePage(this.worldlightingPageRef);
						this.props.Progress.setGoal(new Flipper.Spring((1 / 3) * 2));
					}}
					OnReturn={() => {
						this.changePage(this.worldtemplatePageRef);
						this.props.Progress.setGoal(new Flipper.Spring(0));
					}}
					FrameRef={this.worldinfoPageRef}
					OnUpdate={(info) =>
						this.setState((oldState) => ({
							...oldState,
							...info,
						}))
					}
					Info={{
						Name: this.state.Name,
						Description: this.state.Description,
					}}
				/>
				<WorldLightingPage
					Selected={this.state.Lighting}
					OnNext={() => {
						this.changePage(this.worldfinishPageRef);
						this.props.Progress.setGoal(new Flipper.Spring(1));
					}}
					OnReturn={() => {
						this.changePage(this.worldinfoPageRef);
						this.props.Progress.setGoal(new Flipper.Spring(1 / 3));
					}}
					OnUpdate={(value) =>
						this.setState((oldState) => ({
							...oldState,
							Lighting: value,
						}))
					}
					FrameRef={this.worldlightingPageRef}
				/>
				<WorldFinishPage
					OnCreate={() => {
						if (creating === true) return;
						creating = true;
						notificationStore.addNotification({
							Id: "CreatingWorld",
							Title: "Creating World",
							Message: "This might take some time.",
							Time: 5,
							Icon: "rbxassetid://7148978151",
						});
						createWorld.CallServerAsync(this.state).then((world) => {
							notificationStore.removeNotification("CreatingWorld");
							if (world !== undefined) {
								notificationStore.addNotification({
									Id: "WorldCreationDone",
									Title: "Done creating World",
									Message: `Teleporting you to your newly created world ${world.Settings.Name} [${world.Info.WorldId}]`,
									Time: 5,
									Icon: "rbxassetid://7148978151",
								});
							}
						});
					}}
					OnReturn={() => {
						this.changePage(this.worldlightingPageRef);
						this.props.Progress.setGoal(new Flipper.Spring((1 / 3) * 2));
					}}
					FrameRef={this.worldfinishPageRef}
				/>
				<uipagelayout
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Circular={true}
					EasingDirection={Enum.EasingDirection.InOut}
					EasingStyle={Enum.EasingStyle.Circular}
					TweenTime={0.5}
					Ref={this.uipagelayoutRef}
				/>
			</frame>
		);
	}

	didMount() {
		this.changePage(this.worldtemplatePageRef);
	}
}

export default CreationFramePages;
