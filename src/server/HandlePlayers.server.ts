import { Players, RunService } from "@rbxts/services";
import { entries } from "@rbxts/object-utils";
import { updateWorldInfo } from "shared/worldSettingsReducer";
import WorldManager from "./WorldManager";

const timeList = new Map<number, number>();

function onPlayerJoined(player: Player) {
	timeList.set(player.UserId, os.clock());
}

function onPlayerRemoving(player: Player) {
	timeList.delete(player.UserId);
}

for (const player of Players.GetPlayers()) onPlayerJoined(player);

Players.PlayerAdded.Connect(onPlayerJoined);
Players.PlayerRemoving.Connect(onPlayerRemoving);

RunService.PostSimulation.Connect(() => {
	for (const [id, joinTime] of entries(timeList)) {
		const current = os.clock();
		if (current - joinTime > 60 * 5) {
			WorldManager.store.dispatch(
				updateWorldInfo([
					{ propertyName: "PlaceVisits", value: WorldManager.store.getState().PlaceVisits + 1 },
				]),
			);
			timeList.delete(id);
		}
	}
});
