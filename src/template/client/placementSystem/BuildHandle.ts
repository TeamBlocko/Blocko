import { Workspace, Players, UserInputService, TweenService } from "@rbxts/services";
import { remotes } from "template/shared/remotes";
import { GridBase } from "./GridBase";
import { UpdateBasePart } from "../rodux/placementSettings";
import store from "../store";
import { previousInTable, nextInTable } from "common/shared/utility";
import { shapes as orderedShapes } from "../shapes";
import { mouseTarget } from "template/shared/utility";

const client = Players.LocalPlayer;
const playerGui = client.FindFirstChildOfClass("PlayerGui") as PlayerGui;

const placeBlock = remotes.Client.Get("PlaceBlock");
const deleteBlock = remotes.Client.Get("DeleteBlock");

const PLACE_SIZE_TWEEN = new TweenInfo(0.5, Enum.EasingStyle.Bounce);
const DELETE_SIZE_TWEEN = new TweenInfo(0.2, Enum.EasingStyle.Back, Enum.EasingDirection.In);

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
		const placementSettings = store.getState().PlacementSettings;
		if (this.ghostPart !== undefined && this.ghostPart.GetAttribute("PartType") !== placementSettings.Shape.Name) {
			this.ghostPart.Destroy();
			this.ghostPart = placementSettings.Shape.Clone();
		}

		for (const [propertyName, value] of pairs(placementSettings.RawProperties)) {
			const propertyValue = value;
			this.ghostPart[propertyName] = propertyValue as never;
		}

		this.ghostPart.Anchored = true;
		const placePosition = this.gridBase.mouseGridPosition();
		if (placePosition) this.ghostPart.Position = placePosition;

		this.ghostPart.SetAttribute("PartType", placementSettings.Shape.Name);
		this.ghostPart.CanCollide = false;
		this.ghostPart.Name = "GhostPart";
	}

	nextBlockType() {
		store.dispatch(UpdateBasePart(nextInTable(orderedShapes, store.getState().PlacementSettings.Shape)));
	}

	previousBlockType() {
		store.dispatch(UpdateBasePart(previousInTable(orderedShapes, store.getState().PlacementSettings.Shape)));
	}

	placeBlock() {
		const target = mouseTarget(this.gridBase.maxPlaceDistance, [this.gridBase.blocks]);
		if (this.ghostPart === undefined) return;
		if (target !== undefined) {
			const mousePosition = UserInputService.GetMouseLocation();
			const guis = playerGui.GetGuiObjectsAtPosition(mousePosition.X, mousePosition.Y);
			if (guis.size() < 2 || guis.find((gui) => gui.Name === "NotificationContainer")) {
				const placePosition = this.gridBase.mouseGridPosition();

				if (placePosition === undefined) return;

				const orientation = this.gridBase.getOrientation();
				const placementSettings = store.getState().PlacementSettings;
				const block = placementSettings.Shape.Clone();

				block.Anchored = true;
				block.Position = placePosition;
				block.Orientation = orientation;

				const hitboxPart = new Instance("Part");
				hitboxPart.Size = placementSettings.RawProperties.Size;
				hitboxPart.Transparency = 1;
				hitboxPart.Position = placePosition;
				hitboxPart.Orientation = orientation;
				hitboxPart.CanCollide = false;
				hitboxPart.Anchored = true;
				hitboxPart.Parent = Workspace.Blocks;

				for (const [propertyName, value] of pairs(placementSettings.RawProperties)) {
					const propertyValue = value;
					block[propertyName] = propertyValue as never;
				}

				block.Size = new Vector3(0, 0, 0);
				block.Parent = Workspace.Blocks;

				const tween = TweenService.Create(block, PLACE_SIZE_TWEEN, {
					Size: placementSettings.RawProperties.Size,
				});

				const sound = new Instance("Sound");
				sound.SoundId = "rbxassetid://5996140040";
				sound.Parent = client;
				sound.Ended.Connect(() => sound.Destroy());

				tween.Play();
				sound.Play();
				tween.Completed.Wait();

				const result = placeBlock.CallServer(placePosition, orientation, placementSettings);

				if (result && hitboxPart.Parent === Workspace) deleteBlock.CallServer(result);

				hitboxPart.Destroy();
				block.Destroy();
			}
		}
	}

	deleteBlock() {
		const target = mouseTarget(this.gridBase.maxPlaceDistance, [this.gridBase.blocks]);
		if (target !== undefined) {
			target.Parent = Workspace;

			const tween = TweenService.Create(target, DELETE_SIZE_TWEEN, { Size: new Vector3(0, 0, 0) });
			tween.Play();
			tween.Completed.Wait();

			target.Destroy();

			deleteBlock.CallServer(target);
		}
	}
}

export default BuildHandler;
