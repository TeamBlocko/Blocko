import { Workspace, DataStoreService, ReplicatedStorage, RunService, Players } from "@rbxts/services";
import { Store } from "@rbxts/rodux";
import ProfileService from "@rbxts/profileservice";
import { abbreviateBytes } from "@rbxts/number-manipulator";
import { Profile } from "@rbxts/profileservice/globals";
import { storeInitializer } from "./store";
import Serializer from "shared/blocksSerializer";

export enum BlockIds {
	CornerInnerQuadrant = "0",
	CornerQuadrant = "1",
	CornerSphere = "2",
	CornerWedge = "3",
	Corner = "4",
	Cylinder = "5",
	CutCylinder = "6",
	EdgeInnerQuadran = "7",
	EdgeQuadrant = "8",
	InnerEdgeWedge = "9",
	InvertedCornerSphere = "a",
	InvertedCutCylinder = "b",
	InvertedCylinder = "c",
	Sphere = "d",
	Block = "e",
	Truss = "f",
	Wedge = "g",
}

const serializer = new Serializer(BlockIds, ReplicatedStorage.BlockTypes);

const DEFAULT_WORLD_SETTINGS = {
	Name: "nyzem world #1",
	Description: "No description set.",
	Thumbnail: "",
	Ambient: new Color3(),
	OutdoorAmbient: new Color3(),
	Time: 12,
	CycleEnabled: false,
	Cycle: 0,
	Brightness: 2,
	SoundID: 0,
	Volume: 0.5,
	Pitch: 0,
	IsPlaying: false,
	ResetEnabled: true,
	CollisionsEnabled: true,
	UsernameDistance: 50,
	HealthDistance: 50,
	DefaultWalkSpeed: 16,
	DefaultJumpPower: 10,
	MinCameraZoom: 0,
	MaxCameraZoom: 100,
};

const DEFAULT_WORLDINFO: WorldInfo = {
	WorldId: game.PlaceId,
	Owner: RunService.IsStudio() ? (Players.GetPlayers()[0] || Players.PlayerAdded.Wait()[0]).UserId : 0,
	Banned: [],
	Server: game.JobId,
	MaxPlayers: 25,
	ActivePlayers: Players.GetPlayers().size(),
	PlaceVisits: 0,
	NumberOfBlocks: ReplicatedStorage.Template.GetChildren().size(),

	WorldSettings: DEFAULT_WORLD_SETTINGS,
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
	public readonly store!: Store<WorldInfo, WorldSettingsActionTypes>;

	constructor(placeId: number) {
		const worldInfoProfile = worldsInfoStore.LoadProfileAsync(`${placeId}`, "ForceLoad");
		const worldBlocksProfile = worldBlocksStore.LoadProfileAsync(`${placeId}`, "ForceLoad");

		if (worldInfoProfile !== undefined && worldBlocksProfile !== undefined) {
			worldInfoProfile.Reconcile();
			worldBlocksProfile.Reconcile();
			this.worldInfo = worldInfoProfile;
			this.worldBlocks = worldBlocksProfile;
			this.store = storeInitializer(this.worldInfo.Data);
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
