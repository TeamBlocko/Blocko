import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerFunction } from "@rbxts/net";
import { $terrify } from "rbxts-transformer-t";
import { t } from "@rbxts/t";
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

const placementSettings = $terrify<PlacementSettings>();

const shapes = ReplicatedStorage.BlockTypes;
const placeBlock = new ServerFunction("PlaceBlock", t.Vector3, t.Vector3, placementSettings);
const deleteBlock = new ServerFunction("DeleteBlock", t.instanceIsA("BasePart"));

function updateNumOfBlocks() {
	WorldManager.store.dispatch(
		updateWorldInfo([{ propertyName: "NumberOfBlocks", value: Workspace.Blocks.GetChildren().size() }]),
	);
}

placeBlock.SetRateLimit(1000);
placeBlock.SetClientCache(0);
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
