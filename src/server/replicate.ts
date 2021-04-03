import { Server } from "@rbxts/net";
import { Players } from "@rbxts/services";
import { deepCopy, assign } from "@rbxts/object-utils";
import { WorldSettingsActionTypes } from "shared/worldSettingsReducer";

const worldSettingsRemote = new Server.Event("UpdateWorldSettings");

export function replicate(action: WorldSettingsActionTypes, beforeState: World, afterState: World) {
	const replicatedAction = assign(deepCopy(action), {
		replicated: true,
	});

	if (action.replicateBroadcast) worldSettingsRemote.SendToAllPlayers(replicatedAction);

	if (action.replicateTo !== undefined) {
		const player = Players.GetPlayerByUserId(action.replicateTo);

		if (player === undefined) return;

		worldSettingsRemote.SendToPlayer(player);
	}
}
