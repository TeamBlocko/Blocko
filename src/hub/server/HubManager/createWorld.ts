import { DeepPartial } from "@rbxts/rodux";
import { assign } from "@rbxts/object-utils";
import { ser } from "@rbxts/ser";
import { AssetService } from "@rbxts/services";
import { DataSyncStore } from "common/server/LazLoader";

export = (player: Player, worldsStore: DataSyncStore<WorldDataSync>, ownedWorlds: DataSyncStore<PlayerDataSync>) => {
	const playerFile = ownedWorlds.GetFile(`${player.UserId}`);

	const worlds = playerFile.GetData();
	const worldsCount = worlds.data.ownedWorlds.size();
	print(`Current world size at ${worldsCount}`);
	const worldId = AssetService.CreatePlaceAsync("Blocko World", 5102195906);

	worlds.data.ownedWorlds.push(worldId);

	playerFile.UpdateData(worlds);
	playerFile.SaveData();
	print("Added file");
	print(worldId);
	const worldFile = worldsStore.GetFile(`World${worldId}`);

	const newData: DeepPartial<ser.Serialized<World>> = {
		Info: {
			WorldId: `${worldId}`,
			Owner: `${player.UserId}`,
		},
		Settings: {
			Name: "%s's World #%i".format(player.Name, worldsCount + 1),
		},
	};

	const worldData = worldFile.GetData();

	assign(worldData.data.Info, newData.Info);
	assign(worldData.data.Settings, newData.Settings);

	worldFile.UpdateData(worldData);
	worldFile.SaveData();
	print("created world");

	return worldId;
};