import store from "./store";
import { Client } from "@rbxts/net";
import { AnyAction } from "@rbxts/rodux";
import * as handlers from "./worldSettingsHandlers";
import { WorldSettingsActionTypes } from "shared/worldSettingsReducer";

const updateWorldSettingsRemote = new Client.Event<[action: WorldSettingsActionTypes & AnyAction]>(
	"UpdateWorldSettings",
);

updateWorldSettingsRemote.Connect((action) => store.dispatch(action));

function updateSettings(state: WorldSettings) {
	for (const [propertyName, value] of pairs(state)) {
		if (propertyName in handlers) handlers[propertyName as keyof typeof handlers](value as never);
	}
}

updateSettings(store.getState().World.Settings);
store.changed.connect((newState) => updateSettings(newState.World.Settings));
