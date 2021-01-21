import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerFunction } from "@rbxts/net";
import { $terrify, instanceIsA } from "rbxts-transformer-t";
import { t } from "@rbxts/t";
import { updateWorldInfo } from "shared/worldSettingsReducer";
import WorldManager from "./WorldManager";

interface PlacementSettings {
	Shape: instanceIsA<BasePart>;
	BuildMode: BuildMode;
	RawProperties: RawProperties;
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

placeBlock.SetRateLimit(100);
placeBlock.SetClientCache(0);
placeBlock.SetCallback((player, placePosition, orientation, settings) => {
	if (settings.Shape.IsDescendantOf(shapes) && WorldManager.store.getState().Owner === player.UserId) {
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

		block.Parent = Workspace.Blocks;
		updateNumOfBlocks();
	}
});

deleteBlock.SetCallback((player, target) => {
	if (WorldManager.store.getState().Owner === player.UserId && target.IsDescendantOf(Workspace.Blocks)) {
		target.Destroy();
		updateNumOfBlocks();
	}
});
