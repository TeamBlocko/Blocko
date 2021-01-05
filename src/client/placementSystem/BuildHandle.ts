import { Workspace, Players, UserInputService } from "@rbxts/services";
import { ClientFunction } from "@rbxts/net";
import GridBase from "./GridBase";
import { updateSetting } from "../rodux/placementSettings";
import store from "../store";
import { previousInTable, nextInTable } from "shared/utility";

const client = Players.LocalPlayer;
const playerGui = client.FindFirstChildOfClass("PlayerGui") as PlayerGui;

const placeBlock = new ClientFunction("PlaceBlock");
const deleteBlock = new ClientFunction("DeleteBlock");

class BuildHandler {
	public ghostPart: BasePart;
	public shapes: Instance;

	private gridBase: GridBase;

	constructor(gridBase: GridBase, shapes: Instance) {
		this.gridBase = gridBase;
		this.shapes = shapes;
		this.ghostPart = new Instance("Part");
		this.updateGhostPart();

		store.changed.connect(() => this.updateGhostPart());
	}

	updateGhostPart() {
		if (this.ghostPart !== undefined) {
			this.ghostPart.Destroy();
		}

		this.ghostPart = store.getState().PlacementSettings.Shape.Clone();
		this.gridBase.clearBuildCache();

		for (const [propertyName, value] of pairs(store.getState().PlacementSettings.RawProperties)) {
			this.ghostPart[propertyName] = value as never;
		}
		this.ghostPart.Anchored = true;
		this.ghostPart.CanCollide = false;
		this.ghostPart.Name = "GhostPart";
	}

	nextBlockType() {
		store.dispatch(
			updateSetting({
				settingName: "Shape",
				value: nextInTable(this.shapes.GetChildren() as BasePart[], store.getState().PlacementSettings.Shape),
			}),
		);
	}

	previousBlockType() {
		store.dispatch(
			updateSetting({
				settingName: "Shape",
				value: previousInTable(
					this.shapes.GetChildren() as BasePart[],
					store.getState().PlacementSettings.Shape,
				),
			}),
		);
	}

	placeBlock() {
		const target = this.gridBase.mouseTarget();
		if (this.ghostPart === undefined) return;
		if (target !== undefined) {
			const mousePosition = UserInputService.GetMouseLocation();
			if (!next(playerGui.GetGuiObjectsAtPosition(mousePosition.X, mousePosition.Y))[0]) {
				const placePosition = this.gridBase.mouseGridPosition();

				if (placePosition === undefined) return;

				const orientation = this.gridBase.getOrientation();
				const placementSettings = store.getState().PlacementSettings;
				const block = placementSettings.Shape.Clone();

				block.Position = placePosition;
				block.Orientation = orientation;

				for (const [propertyName, value] of pairs(placementSettings.RawProperties)) {
					block[propertyName] = value as never;
				}

				block.Parent = Workspace.Blocks;

				placeBlock.GetInstance().InvokeServer(placePosition, orientation, placementSettings);

				block.Destroy();
			}
		}
	}

	deleteBlock() {
		const target = this.gridBase.mouseTarget();
		if (target !== undefined) {
			target.Destroy();
			deleteBlock.CallServer(target);
		}
	}
}

export default BuildHandler;
