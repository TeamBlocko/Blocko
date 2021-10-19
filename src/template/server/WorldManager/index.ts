import { Workspace, ReplicatedStorage, Players, AssetService, MemoryStoreService } from "@rbxts/services";
import { AnyAction, Store } from "@rbxts/rodux";
import LazLoader, { DataSyncFile } from "common/server/LazLoader";
import { abbreviateBytes } from "@rbxts/number-manipulator";
import { storeInitializer } from "template/server/store";
import BlockSerializer from "template/server/blocksSerializer";
import { WorldSettingsActionTypes } from "template/shared/worldSettingsReducer";
import { worldInfoSerializer } from "common/server/WorldInfo/worldSchemes";
import { DEFAULT_WORLD } from "common/server/WorldInfo/defaultWorld";
import { copy, assign } from "@rbxts/object-utils";
import { getPlayersWithPerm, toOwnerAndPermissions } from "template/shared/permissionsUtility";
import { remotes } from "common/shared/remotes";

const dataSync = LazLoader.require("DataSync");

const MAX_WORLD_SIZE = 4_000_000;

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

const notificationHandler = remotes.Server.Create("NotificationManager");

const DEFAULT_TEMPLATE = blockSerializer.serializeBlocks(ReplicatedStorage.Template.GetChildren() as BasePart[]);
const DATASTORE_VERSION = ReplicatedStorage.FindFirstChild("TS")
	?.FindFirstChild("Shared")
	?.FindFirstChildOfClass("StringValue")!.Value;
const worldStore = dataSync.GetStore<WorldDataSync>(`Worlds${DATASTORE_VERSION}`, {
	data: worldInfoSerializer.serialize(DEFAULT_WORLD),
});
const blocksStore = dataSync.GetStore(`WorldBlocks${DATASTORE_VERSION}`, {
	Blocks: DEFAULT_TEMPLATE,
});

const activeODS = MemoryStoreService.GetSortedMap(`activeWorlds${DATASTORE_VERSION}`);

class WorldManager {
	public worldInfo: DataSyncFile<WorldDataSync>;
	public worldBlocks: DataSyncFile<{ Blocks: string }>;
	public store: Store<World, WorldSettingsActionTypes & AnyAction>;
	public lastSave = 0;
	public saveInterval = 10;
	public isClosing = false;

	private saveNotificationInterval = 20;

	constructor(placeId: number) {
		print(placeId);
		this.worldInfo = worldStore.GetFile(`World${placeId}`);
		this.worldBlocks = blocksStore.GetFile(`WorldBlocks${placeId}`);
		const worldFile = this.worldInfo.GetData();

		this.store = storeInitializer(
			worldInfoSerializer.deserialize({
				Info: { ...worldFile.data.Info, Server: game.JobId },
				Settings: worldFile.data.Settings,
			}),
		);

		this.store.changed.connect(async (newState) => {
			this.worldInfo.UpdateData(
				assign(this.worldInfo.GetData(), { data: worldInfoSerializer.serialize(newState) }),
			);
			this.worldInfo.SaveData();
		});

		//this.Load();
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
		const state = this.store.getState();
		try {
			AssetService.SavePlaceAsync();
			const shouldSendSaveNotification = os.clock() - this.lastSave > this.saveNotificationInterval;
			if (shouldSendSaveNotification) {
				notificationHandler.SendToPlayers(
					getPlayersWithPerm(toOwnerAndPermissions(state.Info), "Build", Players.GetPlayers()),
					{
						Type: "Add",
						Data: {
							Id: "SaveStatus",
							Title: "Saving World",
							Message: "This shouldn't take long. Report any issue that persists.",
							Time: 5,
							Icon: "rbxassetid://7148978151",
						},
					},
				);
			}
			if (this.isClosing) {
				const newInfo = copy(this.worldInfo.GetData());
				newInfo.data.Info.Server = undefined;
				newInfo.data.Info.ActivePlayers = "0";
				task.spawn(() => {
					this.worldInfo.UpdateData(newInfo);
					this.worldInfo.SaveData();
				});
				activeODS.RemoveAsync(`${newInfo.data.Info.WorldId}`);
				return;
			}
			activeODS.SetAsync(`${state.Info.WorldId}`, state.Info.ActivePlayers, 20);

			const serialized = blockSerializer.serializeBlocks(Workspace.Blocks.GetChildren() as BasePart[]);
			this.worldInfo.UpdateData(assign(this.worldInfo.GetData(), { data: worldInfoSerializer.serialize(state) }));
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

			if (shouldSendSaveNotification) {
				notificationHandler.SendToPlayers(
					getPlayersWithPerm(toOwnerAndPermissions(state.Info), "Build", Players.GetPlayers()),
					[
						{
							Type: "Remove",
							Id: "SaveStatus",
						},
						{
							Type: "Add",
							Data: {
								Id: "SaveStatusFinished",
								Title: "Saving Done",
								Message: `Done Saving. Current world size is at <b><font color="rgb(${stringTextColor})">${abbreviateBytes(
									serialized.size(),
								)}</font></b>`,
								Icon: "rbxassetid://7148978151",
								Time: 5,
							},
						},
					],
				);
				this.lastSave = os.clock();
			}
		} catch (err) {
			notificationHandler.SendToPlayers(
				getPlayersWithPerm(toOwnerAndPermissions(state.Info), "Build", Players.GetPlayers()),
				[
					{
						Type: "Remove",
						Id: "SaveStatus",
					},
					{
						Type: "Add",
						Data: {
							Id: "SaveStatus",
							Title: "Saving Failed",
							Message: `Failed to save with error: ${err}`,
							Icon: "rbxassetid://7148978151",
						},
					},
				],
			);
		}
	}

	ShutDown() {
		this.isClosing = true;
		for (const _ of [1, 2, 3]) {
			const newInfo = copy(this.worldInfo.GetData());
			newInfo.data.Info.Server = undefined;
			newInfo.data.Info.ActivePlayers = "0";
			task.spawn(() => {
				this.worldInfo.UpdateData(newInfo);
				this.worldInfo.SaveData();
			});
			task.spawn(() => {
				{
					activeODS.RemoveAsync(`${newInfo.data.Info.WorldId}`);
				}
				while (activeODS.GetAsync(`${newInfo.data.Info.WorldId}`) !== undefined);
			});
		}
	}
}
print(game.PlaceId);
export default new WorldManager(game.PlaceId);
