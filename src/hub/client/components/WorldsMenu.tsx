import Roact from "@rbxts/roact";
import WorldsContainer from "./WorldsContainer";
import WorldsMenuTopBar from "./WorldsMenuTopBar";

function WorldsMenu() {

	return (
		<imagelabel
			AnchorPoint={new Vector2(1, 0.5)}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Position={UDim2.fromScale(1, 0.5)}
			Size={UDim2.fromScale(0.922, 1)}
			Image={"rbxassetid://6397653967"}
			ScaleType={Enum.ScaleType.Tile}
		>
			<WorldsContainer />
			<WorldsMenuTopBar Text={"WORLDS"} />
		</imagelabel>
	);
};

export default WorldsMenu;