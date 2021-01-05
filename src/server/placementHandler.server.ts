import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { ServerFunction } from "@rbxts/net";
import { t } from "@rbxts/t";

const rawProperties = t.interface({
	Material: t.enum(Enum.Material),
	Anchored: t.boolean,
	CastShadow: t.boolean,
	Size: t.Vector3,
	Transparency: t.number,
	Reflectance: t.number,
	Color: t.Color3,
});

const placementSettings = t.interface({
	Shape: t.instanceIsA("BasePart"),
	RawProperties: rawProperties,
});

const shapes = ReplicatedStorage.BlockTypes;
const placeBlock = new ServerFunction("PlaceBlock", t.Vector3, t.Vector3, placementSettings);
const deleteBlock = new ServerFunction("DeleteBlock", t.instanceIsA("BasePart"));

placeBlock.SetRateLimit(100);
placeBlock.SetClientCache(0);
placeBlock.SetCallback((_, placePosition, orientation, settings) => {
	if (settings.Shape.IsDescendantOf(shapes)) {
		const block = settings.Shape.Clone();
		block.Position = placePosition;
		block.Orientation = orientation;

		for (const [propertyName, value] of pairs(settings.RawProperties)) {
			block[propertyName] = value as never;
		}

		block.Parent = Workspace.Blocks;
	}
});

deleteBlock.SetCallback((_, target) => target.Destroy());
