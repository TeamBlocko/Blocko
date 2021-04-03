import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { Server } from "@rbxts/net";
import { updateWorldInfo } from "shared/worldSettingsReducer";
import WorldManager from "../WorldManager";
import { addPart } from "./FunctionalitiesHandler";
import { FunctionalitiesInstances } from "shared/Functionalities";

interface FunctionalityInstance {
	Name: string;
	Multiple: boolean;
	Properties: { [Key: string]: any };
	GUID: string;
}

declare interface PlacementSettings {
	Shape: BasePart;
	BuildMode: BuildMode;
	RawProperties: RawProperties;
	Functionalities: FunctionalityInstance[];
}

const shapes = ReplicatedStorage.BlockTypes;
const placeBlock = new Server.Function<[placePosition: Vector3, orientation: Vector3, settings: PlacementSettings]>("PlaceBlock");
const deleteBlock = new Server.Function<[target: BasePart]>("DeleteBlock");

function updateNumOfBlocks() {
	WorldManager.store.dispatch(
		updateWorldInfo([{ propertyName: "NumberOfBlocks", value: Workspace.Blocks.GetChildren().size() }]),
	);
}

placeBlock.SetCallback((player, placePosition, orientation, settings) => {
	if (settings.Shape.IsDescendantOf(shapes) && WorldManager.store.getState().Info.Owner === player.UserId) {
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

		addPart(block, settings.Functionalities as FunctionalitiesInstances[]);
		block.Parent = Workspace.Blocks;
		updateNumOfBlocks();
		return block
	}
});

deleteBlock.SetCallback((player, target) => {
	if (WorldManager.store.getState().Info.Owner === player.UserId && target.IsDescendantOf(Workspace.Blocks)) {
		target.Destroy();
		updateNumOfBlocks();
	}
});
