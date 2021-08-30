import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { updateWorldInfo } from "template/shared/worldSettingsReducer";
import WorldManager from "../WorldManager";
import { addPart } from "./FunctionalitiesHandler";
import { FunctionalitiesInstancesValues } from "template/shared/Functionalities";
import { calculatePermissionsOfUser, toOwnerAndPermissions } from "template/shared/permissionsUtility";
import { remotes } from "template/shared/remotes";

const shapes = ReplicatedStorage.BlockTypes;
const placeBlock = remotes.Server.Create("PlaceBlock");
const deleteBlock = remotes.Server.Create("DeleteBlock");

function updateNumOfBlocks() {
	WorldManager.store.dispatch(
		updateWorldInfo([{ propertyName: "NumberOfBlocks", value: Workspace.Blocks.GetChildren().size() }]),
	);
}

placeBlock.SetCallback((player, placePosition, orientation, settings) => {
	if (
		settings.Shape.IsDescendantOf(shapes) &&
		calculatePermissionsOfUser(toOwnerAndPermissions(WorldManager.store.getState().Info), player.UserId).Build
	) {
		const block = settings.Shape.Clone();
		block.Anchored = true;
		block.Position = placePosition;
		block.Orientation = orientation;

		for (const [propertyName, value] of pairs(settings.RawProperties)) {
			const propertyValue = value;
			block[propertyName] = propertyValue as never;
		}

		const actualSize = new Instance("Vector3Value", block);
		actualSize.Value = settings.RawProperties.Size;
		actualSize.Name = "ActualSize";

		addPart(block, settings.Functionalities as FunctionalitiesInstancesValues[]);
		block.Parent = Workspace.Blocks;
		updateNumOfBlocks();
		return block;
	}
});

deleteBlock.SetCallback((player, target) => {
	if (
		calculatePermissionsOfUser(toOwnerAndPermissions(WorldManager.store.getState().Info), player.UserId).Build &&
		target &&
		target.IsDescendantOf(Workspace.Blocks)
	) {
		target.Destroy();
		updateNumOfBlocks();
	}
});
