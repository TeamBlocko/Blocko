import { StoreProvider } from "@rbxts/roact-rodux";
import Roact from "@rbxts/roact";
import store from "client/store";
import BuildUI from "./BuildUI";

function MainUI() {
	return (
		<StoreProvider store={store}>
			<screengui ResetOnSpawn={false} ZIndexBehavior={Enum.ZIndexBehavior.Sibling}>
				<BuildUI />
			</screengui>
		</StoreProvider>
	);
}

export default MainUI;
