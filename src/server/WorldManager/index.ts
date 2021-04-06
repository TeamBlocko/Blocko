import { Workspace, DataStoreService, ReplicatedStorage, Players } from "@rbxts/services";
import { Store } from "@rbxts/rodux";
import { ser } from "@rbxts/ser";
import { Server } from "@rbxts/net";
import LazLoader, { DataSyncFile } from "server/LazLoader";
import { abbreviateBytes } from "@rbxts/number-manipulator";
import { storeInitializer } from "server/store";
import BlockSerializer from "server/blocksSerializer";
import { WorldSettingsActionTypes } from "shared/worldSettingsReducer";
import MockODS from "./MockODS";
import { worldInfoScheme, worldSettingsScheme } from "./worldSchemes";
import { DEFAULT_WORLD } from "./defaultWorld";
import { copy } from "@rbxts/object-utils";

const dataSync = LazLoader.require("DataSync");

const MAX_WORLD_SIZE = 2_000_000;

const SIZE_COLORS = {
	STAGE_ONE: Color3.fromRGB(43, 255, 43),
	STAGE_TWO: Color3.fromRGB(239, 255, 62),
	STAGE_THREE: Color3.fromRGB(255, 44, 44),
} as const;

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

const notificationHandler = new Server.Event<[], [RemoteNotification]>("NotificationManager");

const worldInfoSerializer = ser.interface("World", {
	Info: ser.interface("WorldInfo", worldInfoScheme),
	Settings: ser.interface("WorldSettings", worldSettingsScheme),
});

const DEFAULT_TEMPLATE = blockSerializer.serializeBlocks(ReplicatedStorage.Template.GetChildren() as BasePart[]);
const DATASTORE_VERSION = "Betav-12";

const worldStore = dataSync.GetStore("Worlds", worldInfoSerializer.serialize(DEFAULT_WORLD));
const blocksStore = dataSync.GetStore("WorldBlocks", {
	Blocks: DEFAULT_TEMPLATE,
});

const activeODS =
	game.CreatorId !== 0 ? DataStoreService.GetOrderedDataStore(`activeWorlds${DATASTORE_VERSION}`) : MockODS;

class WorldManager {
	public worldInfo: DataSyncFile<ser.Serialized<World>>;
	public worldBlocks: DataSyncFile<{ Blocks: string }>;
	public store: Store<World, WorldSettingsActionTypes & Rodux.AnyAction>;

	public isClosing = false;

	constructor(placeId: number) {
		this.worldInfo = worldStore.GetFile(`World${placeId}`);
		this.worldBlocks = blocksStore.GetFile(`WorldBlocks${placeId}`);
		const data = this.worldInfo.GetData();
		this.store = storeInitializer(worldInfoSerializer.deserialize({ Info: data.Info, Settings: data.Settings }));
		this.Load();
	}

	Load() {
		const result = opcall(() =>
			blockSerializer.deserializeBlocks(this.worldBlocks.GetData("Blocks"), Workspace.Blocks),
		);
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
			activeODS.SetAsync(`${state.Info.WorldId}`, state.Info.ActivePlayers);

			const serialized = blockSerializer.serializeBlocks(Workspace.Blocks.GetChildren() as BasePart[]);
			this.worldInfo.UpdateData(worldInfoSerializer.serialize(state));
			this.worldBlocks.UpdateData("Blocks", serialized);
			this.worldInfo.SaveData();
			this.worldBlocks.SaveData();

			const worldSize = serialized.size();
			const percentageClose = (worldSize * 100) / MAX_WORLD_SIZE;

			const stagePercentage =
				percentageClose < 50
					? (worldSize * 100) / (MAX_WORLD_SIZE / 2)
					: ((worldSize - MAX_WORLD_SIZE / 2) * 100) / (MAX_WORLD_SIZE / 2);

			const textColor =
				percentageClose < 50
					? SIZE_COLORS.STAGE_ONE.Lerp(SIZE_COLORS.STAGE_TWO, stagePercentage / 100)
					: SIZE_COLORS.STAGE_TWO.Lerp(SIZE_COLORS.STAGE_THREE, stagePercentage / 100);

			const stringTextColor = (["R", "G", "B"] as const)
				.map((colorValue) => math.floor(textColor[colorValue] * 255))
				.join(", ");

			notificationHandler.SendToAllPlayers({
				Type: "Add",
				Data: {
					Id: "SaveStatus",
					Message: `Done Saving. Current world size is at <font color="rgb(${stringTextColor})">${abbreviateBytes(
						serialized.size(),
					)}</font>`,
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
		const newInfo = copy(this.worldInfo.GetData());
		newInfo.Info.Server = undefined;
		this.worldInfo.UpdateData(newInfo);
		activeODS.RemoveAsync(newInfo.Info.WorldId);
	}
}

export default new WorldManager(game.PlaceId);
