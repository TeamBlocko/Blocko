import store from "./store";
import { remotes } from "template/shared/remotes";
import * as handlers from "./worldSettingsHandlers";

const updateWorldSettingsRemote = remotes.Client.Get("UpdateClientSettings");

updateWorldSettingsRemote.Connect((action) => store.dispatch(action));

function updateSettings(state: WorldSettings) {
	for (const [propertyName, value] of pairs(state)) {
		if (propertyName in handlers) handlers[propertyName as keyof typeof handlers](value as never);
	}
}

updateSettings(store.getState().World.Settings);
store.changed.connect((newState) => updateSettings(newState.World.Settings));
