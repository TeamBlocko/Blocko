import { Workspace, DataStoreService, ReplicatedStorage, RunService, Players } from "@rbxts/services";
import { Store } from "@rbxts/rodux";
import { ser } from "@rbxts/ser";
import { ServerEvent } from "@rbxts/net";
import ProfileService from "@rbxts/profileservice";
import { abbreviateBytes } from "@rbxts/number-manipulator";
import { Profile } from "@rbxts/profileservice/globals";
import { storeInitializer } from "server/store";
import BlockSerializer from "server/blocksSerializer";
import { WorldSettingsActionTypes } from "shared/worldSettingsReducer";
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

const notificationHandler = new ServerEvent("NotificationManager");

const PermissionInfo = ser.interface("PermissionInfo", {
	UserId: ser.number,
	Type: ser.string as ser.SerializerStructure<PermissionTypes>
})

const worldInfoSerializer = ser.interface("World", {
	Info: ser.interface("WorldInfo", {
		WorldId: ser.number,
		Owner: ser.number,
		Permissions: ser.array(PermissionInfo),
		Banned: ser.array(ser.number),
		Server: ser.optional(ser.string),
		MaxPlayers: ser.number,
		ActivePlayers: ser.number,
		PlaceVisits: ser.number,
		NumberOfBlocks: ser.number,
	}),
	Settings: ser.interface("WorldSettings", {
		Name: ser.string,
		Description: ser.string,
		Thumbnail: ser.string,
		Ambient: ser.Color3,
		OutdoorAmbient: ser.Color3,
		Time: ser.number,
		CycleEnabled: ser.boolean,
		Cycle: ser.number,
		Brightness: ser.number,
		SoundID: ser.number,
		Volume: ser.number,
		Pitch: ser.number,
		IsPlaying: ser.boolean,
		ResetEnabled: ser.boolean,
		CollisionsEnabled: ser.boolean,
		UsernameDistance: ser.number,
		HealthDistance: ser.number,
		DefaultWalkSpeed: ser.number,
		DefaultJumpPower: ser.number,
		MinCameraZoom: ser.number,
		MaxCameraZoom: ser.number,
	}),
});

const DEFAULT_WORLD_SETTINGS: WorldSettings = {
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
	DefaultJumpPower: 50,
	MinCameraZoom: 0,
	MaxCameraZoom: 100,
};

const DEFAULT_WORLD_INFO: WorldInfo = {
	WorldId: game.PlaceId,
	Owner:
		RunService.IsStudio() || game.CreatorId !== 6467229
			? (Players.GetPlayers()[0] || Players.PlayerAdded.Wait()[0]).UserId
			: 0,
	Permissions: [],
	Banned: [],
	Server: game.JobId,
	MaxPlayers: 25,
	ActivePlayers: Players.GetPlayers().size(),
	PlaceVisits: 0,
	NumberOfBlocks: ReplicatedStorage.Template.GetChildren().size(),
}

const DEFAULT_WORLD: World = {
	Info: DEFAULT_WORLD_INFO,
	Settings: DEFAULT_WORLD_SETTINGS,
};

const DEFAULT_TEMPLATE = blockSerializer.serializeBlocks(ReplicatedStorage.Template.GetChildren() as BasePart[]);

const DATASTORE_VERSION = "Betav-12";

const activeODS = game.CreatorId !== 0 ? DataStoreService.GetOrderedDataStore(`activeWorlds${DATASTORE_VERSION}`) : MockODS;
let worldsInfoStore = ProfileService.GetProfileStore(
	`Worlds${DATASTORE_VERSION}`,
	worldInfoSerializer.serialize(DEFAULT_WORLD),
);
let worldBlocksStore = ProfileService.GetProfileStore(`WorldBlocks${DATASTORE_VERSION}`, {
	Blocks: DEFAULT_TEMPLATE,
});

if (RunService.IsStudio() === true) {
	worldsInfoStore = worldsInfoStore.Mock;
	worldBlocksStore = worldBlocksStore.Mock;
}

class WorldManager {
	public readonly worldInfo!: Profile<ser.Serialized<World>>;
	public readonly worldBlocks!: Profile<{ Blocks: string }>;
	public readonly store!: Store<World, WorldSettingsActionTypes & Rodux.AnyAction>;

	public isClosing = false;

	constructor(placeId: number) {
		const worldInfoProfile = worldsInfoStore.LoadProfileAsync(`${placeId}`, "ForceLoad");
		const worldBlocksProfile = worldBlocksStore.LoadProfileAsync(`${placeId}`, "ForceLoad");

		if (worldInfoProfile !== undefined && worldBlocksProfile !== undefined) {
			worldInfoProfile.Reconcile();
			worldBlocksProfile.Reconcile();
			this.worldInfo = worldInfoProfile;
			this.worldBlocks = worldBlocksProfile;
			this.store = storeInitializer(worldInfoSerializer.deserialize(this.worldInfo.Data));
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
		try {
			notificationHandler.SendToAllPlayers({
				Type: "Add",
				Data: {
					Id: "SaveStatus",
					Message: "Saving World",
					Time: 5,
				},
			});
			const state = this.store.getState();
			activeODS.SetAsync(this.worldInfo.Data.Info.WorldId, state.Info.ActivePlayers);
			// print(this.worldInfo.Data.WorldId, activeODS.GetAsync(this.worldInfo.Data.WorldId));
			const serialized = blockSerializer.serializeBlocks(Workspace.Blocks.GetChildren() as BasePart[]);
			this.worldInfo.Data = worldInfoSerializer.serialize(state);
			this.worldBlocks.Data.Blocks = serialized;
			notificationHandler.SendToAllPlayers({
				Type: "Add",
				Data: {
					Id: "SaveStatus",
					Message: `Done Saving. Current world size is at ${abbreviateBytes(serialized.size())}`,
					Time: 5,
				},
			});
		} catch (err) {
			notificationHandler.SendToAllPlayers({
				Type: "Add",
				Data: {
					Id: "SaveStatus",
					Message: `Failed to save with error: ${err}`,
				},
			});
		}
	}

	ShutDown() {
		this.isClosing = true;
		for (const player of Players.GetPlayers()) player.AncestryChanged.Wait();
		this.worldInfo.Data.Info.Server = undefined;
		activeODS.RemoveAsync(this.worldInfo.Data.Info.WorldId);
		// print(this.worldInfo.Data.WorldId, activeODS.GetAsync(this.worldInfo.Data.WorldId));
	}
}

export default new WorldManager(game.PlaceId);
