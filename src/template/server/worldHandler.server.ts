import { remotes } from "template/shared/remotes";

const retriveWorldSettingsRemote = remotes.Server.Create("Replication");
const updateWorldSettingsRemote = remotes.Server.Create("UpdateWorldSettings");

import WorldManager from "./WorldManager";

retriveWorldSettingsRemote.SetCallback(() => WorldManager.store.getState());

import { Players, TextService } from "@rbxts/services";
import SyncedPoller from "@rbxts/synced-poller";
import { updateWorldInfo } from "template/shared/worldSettingsReducer";
import * as handlers from "./worldSettingsHandlers";

updateWorldSettingsRemote.SetCallback((player, action) => {
	if (WorldManager.store.getState().Info.Owner === player.UserId) {
		const nameIndex = action.data.findIndex(value => value.propertyName === "Name");
		const descriptionIndex = action.data.findIndex(value => value.propertyName === "Description");
		const name = action.data[nameIndex];
		const result = opcall(() => TextService.FilterStringAsync(name.value as string, player.UserId));
		if (result.success && result.value) {
			name.value = result.value.GetNonChatStringForBroadcastAsync();
		}
		const description = action.data[descriptionIndex];
		const result2 = opcall(() => TextService.FilterStringAsync(description.value as string, player.UserId));
		if (result2.success && result2.value) {
			description.value = result2.value.GetNonChatStringForBroadcastAsync();
		}
		WorldManager.store.dispatch(action);
	}
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
WorldManager.store.changed.connect((newState) => {
	updateSettings(newState.Settings)
});

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
