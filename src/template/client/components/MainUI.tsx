import { StoreProvider } from "@rbxts/roact-rodux";
import Roact from "@rbxts/roact";
import store from "template/client/store";
import BuildUI from "./BuildUI";
import WorldMenu from "./WorldMenu";
import { NotificationContainer } from "common/client/components/NotificationContainer";
import { worldMenuContext, ContextType } from "../worldMenuContext";

class MainUI extends Roact.Component<{}, ContextType> {
	constructor() {
		super({});

		this.setState({
			visible: false,
		});
	}

	render() {
		return (
			<StoreProvider store={store}>
				<worldMenuContext.Provider
					value={{
						visible: this.state.visible,
						updateWorldMenu: (visibality) => this.setState({ visible: visibality }),
					}}
				>
					<screengui ResetOnSpawn={false} ZIndexBehavior={Enum.ZIndexBehavior.Sibling} IgnoreGuiInset={true}>
						<BuildUI />
						<WorldMenu />
						<NotificationContainer defaultNotificationWidth={0} />
					</screengui>
				</worldMenuContext.Provider>
			</StoreProvider>
		);
	}
}

export default MainUI;
