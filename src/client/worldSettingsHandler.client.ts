import store from "./store";
import { ClientEvent } from "@rbxts/net";
import { AnyAction } from "@rbxts/rodux";
import * as handlers from "./worldSettingsHandlers";

const updateWorldSettingsRemote = new ClientEvent("UpdateWorldSettings");

updateWorldSettingsRemote.Connect((action: WorldSettingsActionTypes & AnyAction) => store.dispatch(action));

function updateSettings(state: WorldSettings) {
	for (const [propertyName, value] of pairs(state)) {
		if (propertyName in handlers) handlers[propertyName as keyof typeof handlers](value as never);
	}
}

updateSettings(store.getState().WorldInfo.WorldSettings);
store.changed.connect((newState) => updateSettings(newState.WorldInfo.WorldSettings));
