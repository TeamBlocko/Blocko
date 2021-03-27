import { Workspace, Players, UserInputService, TweenService } from "@rbxts/services";
import { ClientFunction } from "@rbxts/net";
import GridBase from "./GridBase";
import { UpdateBasePart } from "../rodux/placementSettings";
import store from "../store";
import { previousInTable, nextInTable } from "shared/utility";

const client = Players.LocalPlayer;
const playerGui = client.FindFirstChildOfClass("PlayerGui") as PlayerGui;

const placeBlock = new ClientFunction("PlaceBlock");
const deleteBlock = new ClientFunction("DeleteBlock");

const SIZE_TWEEN = new TweenInfo(0.5, Enum.EasingStyle.Bounce)

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
		const placementSettings = store.getState().PlacementSettings
		if (this.ghostPart !== undefined && this.ghostPart.GetAttribute("PartType") !== placementSettings.Shape.Name) {
			this.ghostPart.Destroy();
			this.ghostPart = placementSettings.Shape.Clone();
		}

		this.gridBase.clearBuildCache();

		for (const [propertyName, value] of pairs(placementSettings.RawProperties)) {
			let propertyValue = value;
			if ((propertyName === "Transparency" || propertyName === "Reflectance") && typeIs(propertyValue, "number"))
				propertyValue /= 10;
			this.ghostPart[propertyName] = propertyValue as never;
		}

		this.ghostPart.Anchored = true;
		const placePosition = this.gridBase.mouseGridPosition();
		if (placePosition) this.ghostPart.Position = placePosition;

		this.ghostPart.SetAttribute("PartType", placementSettings.Shape.Name)
		this.ghostPart.CanCollide = false;
		this.ghostPart.Name = "GhostPart";
	}

	nextBlockType() {
		store.dispatch(
			UpdateBasePart(
				nextInTable(this.shapes.GetChildren() as BasePart[], store.getState().PlacementSettings.Shape),
			),
		);
	}

	previousBlockType() {
		store.dispatch(
			UpdateBasePart(previousInTable(
					this.shapes.GetChildren() as BasePart[],
					store.getState().PlacementSettings.Shape,
				),
			),
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

				block.Anchored = true;
				block.Position = placePosition;
				block.Orientation = orientation;

				for (const [propertyName, value] of pairs(placementSettings.RawProperties)) {
					let propertyValue = value;
					if ((propertyName === "Transparency" || propertyName === "Reflectance") && typeIs(propertyValue, "number"))
						propertyValue /= 10;
					block[propertyName] = propertyValue as never;
				}

				block.Size = new Vector3(0, 0, 0)
				block.Parent = Workspace.Blocks;

				const tween = TweenService.Create(block, SIZE_TWEEN, { Size: placementSettings.RawProperties.Size })
				tween.Play()

				const serverBlock: BasePart | undefined = placeBlock.GetInstance().InvokeServer(placePosition, orientation, placementSettings);

				if (tween.PlaybackState !== Enum.PlaybackState.Completed) tween.Completed.Wait()
				if (serverBlock !== undefined) {
					serverBlock.Transparency = placementSettings.RawProperties.Transparency / 10	
				}
				block.Destroy();
			}
		}
	}

	deleteBlock() {
		const target = this.gridBase.mouseTarget();
		if (target !== undefined) {
			target.Destroy();
			deleteBlock.GetInstance().InvokeServer(target);
		}
	}
}

export default BuildHandler;
