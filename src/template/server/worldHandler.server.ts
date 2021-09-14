import type { AnyAction } from "@rbxts/rodux";

import { remotes } from "template/shared/remotes";

const retriveWorldSettingsRemote = remotes.Server.Create("Replication");
const updateWorldSettingsRemote = remotes.Server.Create("UpdateWorldSettings");

import WorldManager from "./WorldManager";

retriveWorldSettingsRemote.SetCallback(() => WorldManager.store.getState());

import { Players } from "@rbxts/services";
import SyncedPoller from "@rbxts/synced-poller";
import { updateWorldInfo, WorldSettingsActionTypes } from "template/shared/worldSettingsReducer";
import * as handlers from "./worldSettingsHandlers";

updateWorldSettingsRemote.SetCallback((player, action) => {
	if (WorldManager.store.getState().Info.Owner === player.UserId)
		WorldManager.store.dispatch(action as WorldSettingsActionTypes & AnyAction);
});

game.BindToClose(() => {
	WorldManager.ShutDown();
});

function updateSettings(state: WorldSettings) {
	for (const [propertyName, value] of pairs(state)) {
		if (propertyName in handlers) handlers[propertyName as keyof typeof handlers](value as never);
	}
}

updateSettings(WorldManager.store.getState().Settings);
WorldManager.store.changed.connect((newState) => updateSettings(newState.Settings));

function updatePlayers() {
	WorldManager.store.dispatch(
		updateWorldInfo([{ propertyName: "ActivePlayers", value: Players.GetPlayers().size() }]),
	);
}

updatePlayers();
Players.PlayerAdded.Connect(updatePlayers);
Players.PlayerRemoving.Connect(updatePlayers);

new SyncedPoller(
	WorldManager.saveInterval,
	() => WorldManager.Save(),
	() => true,
);
