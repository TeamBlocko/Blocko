import { StoreProvider } from "@rbxts/roact-rodux";
import Roact from "@rbxts/roact";
import store from "client/store";
import BuildUI from "./BuildUI";
import WorldMenu from "./WorldMenu";
import { NotificationContainer } from "./NotificationContainer";

function MainUI() {
	return (
		<StoreProvider store={store}>
			<screengui ResetOnSpawn={false} ZIndexBehavior={Enum.ZIndexBehavior.Sibling} IgnoreGuiInset={true}>
				<BuildUI />
				<WorldMenu />
				<NotificationContainer defaultNotificationWidth={0} />
			</screengui>
		</StoreProvider>
	);
}

export default MainUI;
