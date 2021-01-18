import { ServerFunction, ServerEvent } from "@rbxts/net";
import { $terrify } from "rbxts-transformer-t";
import * as handlers from "./worldSettingsHandlers";

const retriveWorldSettingsRemote = new ServerFunction("Replication");
const updateWorldSettingsRemote = new ServerEvent("UpdateWorldSettings", $terrify<UpdateWorldSettings>());

import WorldManager from "./WorldManager";

game.BindToClose(() => {
	WorldManager.Save();
});

retriveWorldSettingsRemote.SetCallback(() => WorldManager.store.getState());

updateWorldSettingsRemote.Connect((player, action) => WorldManager.store.dispatch(action as any));

function updateSettings(state: WorldSettings) {
	for (const [propertyName, value] of pairs(state)) {
		if (propertyName in handlers) handlers[propertyName as keyof typeof handlers](value as never);
	}
}

updateSettings(WorldManager.store.getState());
WorldManager.store.changed.connect((newState) => updateSettings(newState));


while (true) {
	wait(10);
	WorldManager.Save();
}
