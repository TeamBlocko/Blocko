import { Players } from "@rbxts/services";
import { ServerFunction } from "@rbxts/net";
import { $terrify } from "rbxts-transformer-t";
import { updateWorldInfo } from "shared/worldSettingsReducer";
import * as handlers from "./worldSettingsHandlers";

const retriveWorldSettingsRemote = new ServerFunction("Replication");
const updateWorldSettingsRemote = new ServerFunction("UpdateWorldSettings", $terrify<UpdateWorldSettings>());

import WorldManager from "./WorldManager";

game.BindToClose(() => {
	WorldManager.ShutDown();
});

retriveWorldSettingsRemote.SetCallback(() => WorldManager.store.getState());

updateWorldSettingsRemote.SetCallback((player, action) => {
	if (WorldManager.store.getState().Owner === player.UserId)
		WorldManager.store.dispatch(action as WorldSettingsActionTypes);
});

function updateSettings(state: WorldSettings) {
	for (const [propertyName, value] of pairs(state)) {
		if (propertyName in handlers) handlers[propertyName as keyof typeof handlers](value as never);
	}
}

updateSettings(WorldManager.store.getState().WorldSettings);
WorldManager.store.changed.connect((newState) => updateSettings(newState.WorldSettings));

function updatePlayers() {
	WorldManager.store.dispatch(
		updateWorldInfo([{ propertyName: "ActivePlayers", value: Players.GetPlayers().size() }]),
	);
}

updatePlayers();
Players.PlayerAdded.Connect(updatePlayers);
Players.PlayerRemoving.Connect(updatePlayers);

while (!WorldManager.isClosing) {
	WorldManager.Save();
	wait(10);
}
