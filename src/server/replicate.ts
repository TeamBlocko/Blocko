import { ServerEvent } from "@rbxts/net";
import { Players } from "@rbxts/services";
import { deepCopy, assign } from "@rbxts/object-utils";

const worldSettingsRemote = new ServerEvent("UpdateWorldSettings")

export function replicate(action: ActionRecievedUpdateWorldSettings, beforeState: WorldSettings, afterState: WorldSettings) {
	
	const replicatedAction = assign(deepCopy(action), {
		replicated: true,
	})

	if (action.replicateBroadcast)
		worldSettingsRemote.SendToAllPlayers(replicatedAction)

	if (action.replicateTo !== undefined) {
		const player = Players.GetPlayerByUserId(action.replicateTo)

		if (player === undefined) return

		worldSettingsRemote.SendToPlayer(player)
	}
}