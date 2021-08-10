import { Server } from "@rbxts/net";

const fetchWorlds = new Server.AsyncFunction<[Filter]>("FetchWorlds").SetCallTimeout(100);
const fetchWorldInfo = new Server.AsyncFunction<[number]>("FetchWorldInfo").SetCallTimeout(100);
const createWorldRemote = new Server.AsyncFunction<[CreationOptions], [], unknown, World | undefined>(
	"CreateWorld",
).SetCallTimeout(100);
const teleportPlayer = new Server.AsyncFunction<[number]>("TeleportPlayer").SetCallTimeout(100);

import { DataStoreService, TeleportService, Players, ReplicatedStorage, RunService } from "@rbxts/services";
import MockODS from "common/server/MockODS";
import LazLoader from "common/server/LazLoader";
import { worldInfoScheme, worldSettingsScheme } from "common/server/WorldInfo/worldSchemes";
import { ser } from "@rbxts/ser";
import { DEFAULT_WORLD } from "common/server/WorldInfo/defaultWorld";
import createWorld from "./createWorld";

const dataSync = LazLoader.require("DataSync");

const worldInfoSerializer = ser.interface("World", {
	Info: ser.interface("WorldInfo", worldInfoScheme),
	Settings: ser.interface("WorldSettings", worldSettingsScheme),
});

const DATASTORE_VERSION = ReplicatedStorage.FindFirstChild("TS")
	?.FindFirstChild("Shared")
	?.FindFirstChildOfClass("StringValue")!.Value;

const worldStore = dataSync.GetStore<WorldDataSync>(`Worlds${DATASTORE_VERSION}`, {
	data: worldInfoSerializer.serialize(DEFAULT_WORLD),
});
const ownedWorlds = dataSync.GetStore<PlayerDataSync>(`ownedWorlds${DATASTORE_VERSION}`, { data: { ownedWorlds: [] } });
const activeODS =
	game.CreatorId !== 0 ? DataStoreService.GetOrderedDataStore(`activeWorlds${DATASTORE_VERSION}`) : MockODS;

const joiningWorld = new Map<number, boolean>();
const teleportFailDetectors = new Map<number, RBXScriptConnection>();

teleportPlayer.SetCallback((player, worldId) => {
	if (!joiningWorld.get(player.UserId)) {
		joiningWorld.set(player.UserId, true);
		const worldInfo = worldInfoSerializer.deserialize(worldStore.GetFile(`World${worldId}`).GetData().data).Info;
		if (worldInfo.Server) {
			TeleportService.TeleportToPlaceInstance(worldId, worldInfo.Server, player);
		} else {
			TeleportService.TeleportAsync(worldId, [player]);
		}
		teleportFailDetectors.get(player.UserId)?.Disconnect();
		teleportFailDetectors.delete(player.UserId);
		teleportFailDetectors.set(
			player.UserId,
			TeleportService.TeleportInitFailed.Connect((failedPlayer, result) => {
				if (player === failedPlayer) {
					if (
						result === Enum.TeleportResult.GameNotFound ||
						result === Enum.TeleportResult.Unauthorized ||
						result === Enum.TeleportResult.GameEnded
					) {
						TeleportService.TeleportAsync(worldId, [player]);
					}
					teleportFailDetectors.get(player.UserId)?.Disconnect();
					teleportFailDetectors.delete(player.UserId);
				}
			}),
		);
	}
});

Players.PlayerRemoving.Connect((player) => {
	joiningWorld.delete(player.UserId);
	teleportFailDetectors.get(player.UserId)?.Disconnect();
	teleportFailDetectors.delete(player.UserId);
});

createWorldRemote.SetCallback((player, options) => {
	if (!joiningWorld.get(player.UserId)) {
		const world = createWorld(player, worldStore, ownedWorlds, options);
		joiningWorld.set(player.UserId, true);
		TeleportService.TeleportAsync(world.Info.WorldId, [player]);
		return world;
	}
});

function getKeys(pages: Array<{ key: string; value: unknown }>): number[] {
	return pages.map((world) => tonumber(world.key)!);
}

function fetchActive(): FetchWorldsResult {
	const result = opcall(() => activeODS.GetSortedAsync(false, 24, 1));
	if (result.success) {
		return { success: true, data: getKeys(result.value.GetCurrentPage()) };
	} else {
		return { success: false, error: result.error };
	}
}

function fetchOwned(player: Player): FetchWorldsResult {
	const playerFile = ownedWorlds.GetFile(`${player.UserId}`);
	return { success: true, data: playerFile.GetData().data.ownedWorlds };
}

fetchWorlds.SetCallback((player, filter): FetchWorldsResult => {
	if (RunService.IsStudio()) return { success: true, data: [0]}
	switch (filter) {
		case "Active":
			return fetchActive();
		case "Owned":
			return fetchOwned(player);
		default:
			return fetchActive();
	}
});

fetchWorldInfo.SetCallback((_player, worldId): World => {
	if (worldId === 0) return DEFAULT_WORLD;
	return worldInfoSerializer.deserialize(worldStore.GetFile(`World${worldId}`).GetData().data);
});
