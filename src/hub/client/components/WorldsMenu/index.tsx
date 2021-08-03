import Roact from "@rbxts/roact";
import PopupFrames from "./PopupFrames";
import WorldsContainer from "./WorldsContainer";
import WorldsMenuTopBar from "./WorldsMenuTopBar";
import { popupFrameContext, ContextType, Popup } from "./popupFramesContext";

class WorldsMenu extends Roact.Component<{}, ContextType> {
	changePopup(newPopup?: Popup) {
		this.setState((oldState) => ({
			...oldState,
			OpenPopup: newPopup,
		}));
	}

	constructor() {
		super({});

		this.setState({});
	}

	render() {
		return (
			<popupFrameContext.Provider
				value={{
					OpenPopup: this.state.OpenPopup,
					changePopup: (newPopup) => this.changePopup(newPopup),
				}}
			>
				<imagelabel
					AnchorPoint={new Vector2(1, 0.5)}
					BackgroundColor3={Color3.fromRGB(20, 20, 20)}
					BorderSizePixel={0}
					Position={UDim2.fromScale(1, 0.5)}
					Size={UDim2.fromScale(0.922, 1)}
					Image={"rbxassetid://6397653967"}
					ImageTransparency={1}
					ScaleType={Enum.ScaleType.Tile}
				>
					<PopupFrames />
					<WorldsContainer />
					<WorldsMenuTopBar Text={"WORLDS"} />
				</imagelabel>
			</popupFrameContext.Provider>
		);
	}
}

export default WorldsMenu;
