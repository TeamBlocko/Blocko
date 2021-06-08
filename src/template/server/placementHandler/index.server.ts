import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { Server } from "@rbxts/net";
import { updateWorldInfo } from "template/shared/worldSettingsReducer";
import WorldManager from "../WorldManager";
import { addPart } from "./FunctionalitiesHandler";
import { FunctionalitiesInstancesValues } from "template/shared/Functionalities";
import { PlacementSettings } from "template/shared/Types";
import { calculatePermissionsOfUser } from "template/shared/permissionsUtility";

const shapes = ReplicatedStorage.BlockTypes;
const placeBlock = new Server.Function<[placePosition: Vector3, orientation: Vector3, settings: PlacementSettings]>(
	"PlaceBlock",
);
const deleteBlock = new Server.Function<[target: BasePart]>("DeleteBlock");

function updateNumOfBlocks() {
	WorldManager.store.dispatch(
		updateWorldInfo([{ propertyName: "NumberOfBlocks", value: Workspace.Blocks.GetChildren().size() }]),
	);
}

placeBlock.SetCallback((player, placePosition, orientation, settings) => {
	if (
		settings.Shape.IsDescendantOf(shapes) &&
		calculatePermissionsOfUser(WorldManager.store.getState().Info, player.UserId).Build
	) {
		const block = settings.Shape.Clone();
		block.Anchored = true;
		block.Position = placePosition;
		block.Orientation = orientation;

		for (const [propertyName, value] of pairs(settings.RawProperties)) {
			let propertyValue = value;
			if ((propertyName === "Transparency" || propertyName === "Reflectance") && typeIs(propertyValue, "number"))
				propertyValue /= 10;
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
		calculatePermissionsOfUser(WorldManager.store.getState().Info, player.UserId).Build &&
		target.IsDescendantOf(Workspace.Blocks)
	) {
		target.Destroy();
		updateNumOfBlocks();
	}
});
