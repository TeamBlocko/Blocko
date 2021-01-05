import { Workspace, DataStoreService, ReplicatedStorage, RunService } from "@rbxts/services";
import ProfileService from "@rbxts/profileservice";
import { abbreviateBytes } from "@rbxts/number-manipulator";
import { Profile } from "@rbxts/profileservice/globals";
import Serializer from "shared/blocksSerializer";

const serializer = new Serializer();

const DEFAULT_WORLDINFO: WorldInfo = {
	WorldId: game.PlaceId,
	Name: "Block World",
	Owner: 0,
	Banned: [],
	Server: game.JobId,
	MaxPlayers: 25,
	ActivePlayers: 0,
	Blocks: "",
};

let worldsInfoStore = ProfileService.GetProfileStore("Worlds", DEFAULT_WORLDINFO);
let worldBlocksStore = ProfileService.GetProfileStore("WorldBlocks", {
	Blocks: serializer.serializeBlocks(ReplicatedStorage.Template.GetChildren() as BasePart[]),
});

if (RunService.IsStudio() === true) {
	worldsInfoStore = worldsInfoStore.Mock;
	worldBlocksStore = worldBlocksStore.Mock;
}

class WorldManager {
	public readonly worldInfo!: Profile<WorldInfo>;
	public readonly worldBlocks!: Profile<{ Blocks: string }>;

	constructor(placeId: number) {
		const worldInfoProfile = worldsInfoStore.LoadProfileAsync(`${placeId}`, "ForceLoad");
		const worldBlocksProfile = worldBlocksStore.LoadProfileAsync(`${placeId}`, "ForceLoad");

		if (worldInfoProfile !== undefined && worldBlocksProfile !== undefined) {
			worldInfoProfile.Reconcile();
			worldBlocksProfile.Reconcile();
			this.worldInfo = worldInfoProfile;
			this.worldBlocks = worldBlocksProfile;
			this.Load();
		} else {
			// FAILED TO LOAD
		}
	}

	Load() {
		serializer.deserializeBlocks(this.worldBlocks.Data.Blocks, Workspace.Blocks);
	}

	Save() {
		const serialized = serializer.serializeBlocks(Workspace.Blocks.GetChildren() as BasePart[]);
		print(abbreviateBytes(serialized.size()));
		this.worldBlocks.Data.Blocks = serialized;
		this.worldBlocks.Save();
	}

	ShutDown() {}
}

export default new WorldManager(game.PlaceId);
