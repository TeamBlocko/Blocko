import { assign } from "@rbxts/object-utils";
import { ser } from "@rbxts/ser";
import { AssetService } from "@rbxts/services";
import { DataSyncStore } from "common/server/LazLoader";

type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};

const template_places: { [K in Exclude<keyof typeof Enum.Technology, "GetEnumItems">]: number } = {
	Compatibility: 5102195906,
	Voxel: 7195338159,
	ShadowMap: 7195431613,
	Future: 7195436456,
	Legacy: 0,
};

export = (
	player: Player,
	worldsStore: DataSyncStore<WorldDataSync>,
	ownedWorlds: DataSyncStore<PlayerDataSync>,
	options: CreationOptions,
) => {
	const playerFile = ownedWorlds.GetFile(`${player.UserId}`);

	const worlds = playerFile.GetData();
	const worldsCount = worlds.data.ownedWorlds.size();
	print(`Current world size at ${worldsCount}`);
	const worldId = AssetService.CreatePlaceAsync("Blocko World", template_places[options.Lighting.Name]);

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
			Name: options.Name ?? "%s's World #%i".format(player.Name, worldsCount + 1),
			Description: options.Description,
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
