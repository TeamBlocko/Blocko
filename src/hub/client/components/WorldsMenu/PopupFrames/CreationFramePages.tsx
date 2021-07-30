import Roact from "@rbxts/roact";
import WorldFinishPage from "./WorldFinishPage";
import WorldInfoPage from "./WorldInfoPage";
import WorldLightingPage from "./WorldLightingPage";
import WorldTemplatePage from "./WorldTemplatePage";

class CreationFramePages extends Roact.Component {
	worldtemplatePageRef: Roact.Ref<Frame>;
	worldinfoPageRef: Roact.Ref<Frame>;
	worldlightingPageRef: Roact.Ref<Frame>;
	worldfinishPageRef: Roact.Ref<Frame>;
	uipagelayoutRef: Roact.Ref<UIPageLayout>;

	constructor() {
		super({});

		this.worldtemplatePageRef = Roact.createRef();
		this.worldinfoPageRef = Roact.createRef();
		this.worldlightingPageRef = Roact.createRef();
		this.worldfinishPageRef = Roact.createRef();
		this.uipagelayoutRef = Roact.createRef();
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
			<frame BackgroundTransparency={1} ClipsDescendants={true} Size={UDim2.fromScale(1, 1)}>
				<WorldTemplatePage
					FrameRef={this.worldtemplatePageRef}
					OnNext={() => this.changePage(this.worldinfoPageRef)}
				/>
				<WorldInfoPage
					OnNext={() => this.changePage(this.worldlightingPageRef)}
					OnReturn={() => this.changePage(this.worldtemplatePageRef)}
					FrameRef={this.worldinfoPageRef}
				/>
				<WorldLightingPage
					OnNext={() => this.changePage(this.worldfinishPageRef)}
					OnReturn={() => this.changePage(this.worldinfoPageRef)}
					FrameRef={this.worldlightingPageRef}
				/>
				<WorldFinishPage
					OnCreate={() => print("Finished create")}
					OnReturn={() => this.changePage(this.worldlightingPageRef)}
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
