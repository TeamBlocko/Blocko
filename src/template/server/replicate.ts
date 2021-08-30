import { Players } from "@rbxts/services";
import { deepCopy, assign } from "@rbxts/object-utils";
import { WorldSettingsActionTypes } from "template/shared/worldSettingsReducer";
import { remotes } from "template/shared/remotes";
import { AnyAction } from "@rbxts/rodux";

const worldSettingsRemote = remotes.Server.Create("UpdateClientSettings");

export function replicate(action: WorldSettingsActionTypes, beforeState: World, afterState: World) {
	const replicatedAction = assign(deepCopy(action), {
		replicated: true,
	}) as WorldSettingsActionTypes & AnyAction;

	if (action.replicateBroadcast) worldSettingsRemote.SendToAllPlayers(replicatedAction);

	if (action.replicateTo !== undefined) {
		const player = Players.GetPlayerByUserId(action.replicateTo);

		if (player === undefined) return;

		worldSettingsRemote.SendToPlayer(player, replicatedAction);
	}
}
