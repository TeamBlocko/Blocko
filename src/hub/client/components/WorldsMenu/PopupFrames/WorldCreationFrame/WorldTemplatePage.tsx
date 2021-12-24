import { ReplicatedStorage } from "@rbxts/services";
import Roact from "@rbxts/roact";
import BottomFrame from "./BottomFrame";
import TopFrame from "./TopFrame";
import { popupFrameContext } from "../../popupFramesContext";

const previewTemplates = ReplicatedStorage.FindFirstChild("TemplatePreviews");
const miniBaseplate = previewTemplates?.FindFirstChild("MiniBaseplate");

interface WorldTemplatePagePropTypes {
	FrameRef: Roact.Ref<Frame>;
	OnNext: () => void;
}

class MidFrame extends Roact.Component {
	viewportFrameRef: Roact.Ref<Frame>;

	constructor() {
		super({});

		this.viewportFrameRef = Roact.createRef();
	}

	render() {
		return (
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(162, 199, 255)}
				ClipsDescendants={true}
				Position={UDim2.fromScale(0.5, 0.535)}
				Size={UDim2.fromScale(0.85, 0.45)}
			>
				<frame
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0)}
					Size={UDim2.fromScale(0.6, 0.9)}
					Ref={this.viewportFrameRef}
				>
					<uipagelayout
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						Circular={true}
						EasingDirection={Enum.EasingDirection.InOut}
						EasingStyle={Enum.EasingStyle.Quint}
						TweenTime={0.75}
					/>
				</frame>
				<frame
					AnchorPoint={new Vector2(0, 1)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0, 0.9)}
					Size={UDim2.fromScale(1, 0.1)}
				>
					<imagebutton
						AnchorPoint={new Vector2(1, 0.5)}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.95, 0.5)}
						Size={UDim2.fromScale(1, 1)}
						Image={"rbxassetid://3926305904"}
						ImageRectOffset={new Vector2(124, 924)}
						ImageRectSize={new Vector2(36, 36)}
					>
						<uiaspectratioconstraint />
					</imagebutton>
					<textlabel
						BackgroundTransparency={1}
						Size={UDim2.fromScale(0.35, 1)}
						Font={Enum.Font.GothamBold}
						Text={"Mini Baseplate"}
						TextColor3={new Color3(1, 1, 1)}
						TextScaled={true}
						TextSize={14}
						TextWrapped={true}
					/>
					<imagebutton
						AnchorPoint={new Vector2(1, 0.5)}
						BackgroundTransparency={1}
						Position={UDim2.fromScale(0.95, 0.5)}
						Size={UDim2.fromScale(1, 1)}
						Image={"rbxassetid://3926305904"}
						ImageRectOffset={new Vector2(924, 884)}
						ImageRectSize={new Vector2(36, 36)}
					>
						<uiaspectratioconstraint />
					</imagebutton>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						Padding={new UDim(0.05)}
					/>
				</frame>
				<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(-0.1, 0)} />
				<uicorner CornerRadius={new UDim(0.05, 0)} />
				<uigradient Color={new ColorSequence(new Color3(1, 1, 1))} Rotation={-90} />
			</frame>
		);
	}

	didMount() {
		const viewportFrame = this.viewportFrameRef.getValue();

		if (!viewportFrame) return print("No ViewportFrame");
		if (!miniBaseplate) return print("No miniBaseplate");

		miniBaseplate.Clone().Parent = viewportFrame;
	}
}

function WorldTemplatePage(props: WorldTemplatePagePropTypes) {
	return (
		<popupFrameContext.Consumer
			render={(value) => {
				return (
					<frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={1}
						ClipsDescendants={true}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={UDim2.fromScale(1, 1)}
						Ref={props.FrameRef}
					>
						<TopFrame Title={"Create Worlds"} Description={"Choose a starter template for your world."} />
						<MidFrame />
						<BottomFrame
							Button1Click={() => value.changePopup(Roact.None)}
							Button1Text={"Cancel"}
							Button2Click={() => props.OnNext()}
							Button2Text={"Next"}
						/>
					</frame>
				);
			}}
		/>
	);
}

export default WorldTemplatePage;
