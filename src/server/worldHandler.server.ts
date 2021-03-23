import { Players } from "@rbxts/services";
import { ServerFunction } from "@rbxts/net";
import SyncedPoller from "@rbxts/synced-poller";
import { $terrify } from "rbxts-transformer-t";
import { updateWorldInfo, UpdateWorldSettingDataType, WorldSettingsActionTypes } from "shared/worldSettingsReducer";
import * as handlers from "./worldSettingsHandlers";

declare interface UpdateWorldSettings {
	readonly data: UpdateWorldSettingDataType[];
	readonly replicateBroadcast?: boolean;
	readonly replicateTo?: number;
	readonly replicated?: boolean;
}

const retriveWorldSettingsRemote = new ServerFunction("Replication");
const updateWorldSettingsRemote = new ServerFunction("UpdateWorldSettings", $terrify<UpdateWorldSettings>());

import WorldManager from "./WorldManager";

game.BindToClose(() => {
	WorldManager.ShutDown();
});

retriveWorldSettingsRemote.SetCallback(() => WorldManager.store.getState());

updateWorldSettingsRemote.SetCallback((player, action) => {
	if (WorldManager.store.getState().Info.Owner === player.UserId)
		WorldManager.store.dispatch(action as WorldSettingsActionTypes & Rodux.AnyAction);
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
	10,
	() => WorldManager.Save(),
	() => !WorldManager.isClosing,
);
