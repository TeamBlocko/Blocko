import Roact from "@rbxts/roact";
import BuildUI from "./BuildUI";

function MainUI() {
	return (
		<screengui ZIndexBehavior={Enum.ZIndexBehavior.Sibling}>
			<BuildUI/>
		</screengui>
	)
}

export default MainUI;
