import store from "./store";
import { ClientEvent } from "@rbxts/net";
import { AnyAction } from "@rbxts/rodux";
import * as handlers from "shared/worldSettingsHandler";

const updateWorldSettingsRemote = new ClientEvent("UpdateWorldSettings");

updateWorldSettingsRemote.Connect((action: ActionRecievedUpdateWorldSettings & AnyAction) => store.dispatch(action));

function updateSettings(state: WorldSettings) {
	for (const [propertyName, value] of pairs(state)) {
		if (propertyName in handlers) handlers[propertyName as keyof typeof handlers](value as any);
	}
}

updateSettings(store.getState().WorldSettings);
store.changed.connect((newState) => updateSettings(newState.WorldSettings));
