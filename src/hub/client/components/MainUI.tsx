import Roact from "@rbxts/roact";
import NavBar from "./NavBar";

function MainUI() {
	return (
		<screengui ResetOnSpawn={false} ZIndexBehavior={Enum.ZIndexBehavior.Sibling} IgnoreGuiInset={true}>
			<frame BackgroundColor3={Color3.fromRGB(66, 66, 66)} Size={UDim2.fromScale(1, 1)}>
				<NavBar />
			</frame>
		</screengui>
	);
}

export default MainUI;
