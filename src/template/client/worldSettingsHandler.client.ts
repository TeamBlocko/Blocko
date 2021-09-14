import store from "./store";
import { remotes } from "template/shared/remotes";
import * as handlers from "./worldSettingsHandlers";
import { toggleDebug } from "./rodux/updateDebug";

const updateWorldSettingsRemote = remotes.Client.Get("UpdateClientSettings");
const debugToggle = remotes.Client.Get("ToggleDebug");

updateWorldSettingsRemote.Connect((action) => store.dispatch(action));

debugToggle.Connect(() => store.dispatch(toggleDebug()))

function updateSettings(state: WorldSettings) {
	for (const [propertyName, value] of pairs(state)) {
		if (propertyName in handlers) handlers[propertyName as keyof typeof handlers](value as never);
	}
}

updateSettings(store.getState().World.Settings);
store.changed.connect((newState) => updateSettings(newState.World.Settings));
