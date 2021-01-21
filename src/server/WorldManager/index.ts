import { Workspace, DataStoreService, ReplicatedStorage, RunService, Players } from "@rbxts/services";
import { Store } from "@rbxts/rodux";
import { ServerEvent } from "@rbxts/net";
import ProfileService from "@rbxts/profileservice";
import { abbreviateBytes } from "@rbxts/number-manipulator";
import { Profile } from "@rbxts/profileservice/globals";
import { storeInitializer } from "server/store";
import BlockSerializer from "shared/blocksSerializer";
import WorldInfoSerializer from "./worldInfoSerializer";
import MockODS from "./MockODS";

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

const blockSerializer = new BlockSerializer(BlockIds, ReplicatedStorage.BlockTypes);
const worldInfoSerializer = new WorldInfoSerializer();

const notificationHandler = new ServerEvent("NotificationManager");

const DEFAULT_WORLD_SETTINGS = {
	Name: "nyzem world #1",
	Description: "No description set.",
	Thumbnail: "",
	Ambient: Color3.fromRGB(127, 127, 127),
	OutdoorAmbient: Color3.fromRGB(127, 127, 127),
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
	Owner:
		RunService.IsStudio() || game.CreatorId !== 6467229
			? (Players.GetPlayers()[0] || Players.PlayerAdded.Wait()[0]).UserId
			: 0,
	Banned: [],
	Server: game.JobId,
	MaxPlayers: 25,
	ActivePlayers: Players.GetPlayers().size(),
	PlaceVisits: 0,
	NumberOfBlocks: ReplicatedStorage.Template.GetChildren().size(),

	WorldSettings: DEFAULT_WORLD_SETTINGS,
};

const DEFAULT_TEMPLATE = blockSerializer.serializeBlocks(ReplicatedStorage.Template.GetChildren() as BasePart[]);

const activeODS = !RunService.IsStudio() ? DataStoreService.GetOrderedDataStore("activeWorldsBetav-7") : MockODS;

let worldsInfoStore = ProfileService.GetProfileStore("Worlds", worldInfoSerializer.serializeInfo(DEFAULT_WORLDINFO));
let worldBlocksStore = ProfileService.GetProfileStore("WorldBlocks", {
	Blocks: DEFAULT_TEMPLATE,
});

if (RunService.IsStudio() === true) {
	worldsInfoStore = worldsInfoStore.Mock;
	worldBlocksStore = worldBlocksStore.Mock;
}

class WorldManager {
	public readonly worldInfo!: Profile<SerializedWorldInfo>;
	public readonly worldBlocks!: Profile<{ Blocks: string }>;
	public readonly store!: Store<WorldInfo, WorldSettingsActionTypes>;

	public isClosing = false;

	constructor(placeId: number) {
		const worldInfoProfile = worldsInfoStore.LoadProfileAsync(`${placeId}`, "ForceLoad");
		const worldBlocksProfile = worldBlocksStore.LoadProfileAsync(`${placeId}`, "ForceLoad");

		if (worldInfoProfile !== undefined && worldBlocksProfile !== undefined) {
			worldInfoProfile.Reconcile();
			worldBlocksProfile.Reconcile();
			this.worldInfo = worldInfoProfile;
			this.worldBlocks = worldBlocksProfile;
			this.store = storeInitializer(worldInfoSerializer.deserializeInfo(this.worldInfo.Data));
			this.Load();
		} else {
			// FAILED TO LOAD
		}
	}

	Load() {
		const result = opcall(() => blockSerializer.deserializeBlocks(this.worldBlocks.Data.Blocks, Workspace.Blocks));
		if (!result.success) {
			Workspace.Blocks.ClearAllChildren();
			blockSerializer.deserializeBlocks(DEFAULT_TEMPLATE, Workspace.Blocks);
		}
	}

	Save() {
		notificationHandler.SendToAllPlayers({
			Type: "Add",
			Data: {
				Id: "SaveStatus",
				Message: "Saving World",
				Time: 5,
			},
		});
		activeODS.SetAsync(this.worldInfo.Data.WorldId, this.worldInfo.Data.ActivePlayers);
		const serialized = blockSerializer.serializeBlocks(Workspace.Blocks.GetChildren() as BasePart[]);
		print(abbreviateBytes(serialized.size()));
		this.worldInfo.Data = worldInfoSerializer.serializeInfo(this.store.getState());
		this.worldBlocks.Data.Blocks = serialized;
		this.worldInfo.Save();
		this.worldBlocks.Save();
		notificationHandler.SendToAllPlayers({
			Type: "Add",
			Data: {
				Id: "SaveStatus",
				Message: `Done Saving. Current world size is at ${abbreviateBytes(serialized.size())}`,
				Time: 5,
			},
		});
	}

	ShutDown() {
		this.isClosing = true;
		activeODS.SetAsync(this.worldInfo.Data.WorldId, undefined);
	}
}

export default new WorldManager(game.PlaceId);
