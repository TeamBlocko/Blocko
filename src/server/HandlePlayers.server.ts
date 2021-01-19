import { Players, RunService } from "@rbxts/services";
import { entries } from "@rbxts/object-utils";
import { updateWorldInfo } from "shared/worldSettingsReducer";
import WorldManager from "./WorldManager";

const timeList: { [Id: number]: number } = {};

function onPlayerJoined(player: Player) {
	timeList[player.UserId] = os.clock();
}

function onPlayerRemoving(player: Player) {
	delete timeList[player.UserId]
}

for (const player of Players.GetPlayers())
	onPlayerJoined(player)

Players.PlayerAdded.Connect(onPlayerJoined);
Players.PlayerRemoving.Connect(onPlayerRemoving);

RunService.Heartbeat.Connect(() => {
	for (const [id, joinTime] of entries(timeList)) {
		const current = os.clock();
		if (current - joinTime > 60 * 5) {
			WorldManager.store.dispatch(
				updateWorldInfo([{ propertyName: "PlaceVisits", value: WorldManager.store.getState().PlaceVisits + 1 }]),
			);
			delete timeList[id]
		}
	}
})
