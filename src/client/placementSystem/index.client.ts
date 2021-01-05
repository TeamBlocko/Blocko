import { Workspace, ReplicatedStorage, UserInputService, RunService, TweenService, Players } from "@rbxts/services";
import store from "client/store";
import GridBase from "./GridBase";
import BuildHandle from "./BuildHandle";
import { updateSetting } from "client/rodux/placementSettings";

const client = Players.LocalPlayer;
const playerGui = client.WaitForChild("PlayerGui");
const shapes = ReplicatedStorage.BlockTypes;

const SPECTATE_COLOR = Color3.fromRGB(255, 255, 255),
	BUILD_COLOR = Color3.fromRGB(65, 179, 255),
	DELETE_COLOR = Color3.fromRGB(255, 110, 110);

const gridBase = new GridBase({
	Blocks: Workspace.Blocks,
	MaxPlaceDistance: 1e3,
	RotationTweenInfo: new TweenInfo(0.25, Enum.EasingStyle.Quint),
});
const buildHandle = new BuildHandle(gridBase, shapes);

const tweenInfo = new TweenInfo(0.1, Enum.EasingStyle.Quint);

function updateMode(newMode: BuildMode) {
	store.dispatch(
		updateSetting({
			settingName: "BuildMode",
			value: newMode,
		})
	)
}

RunService.RenderStepped.Connect(() => {
	const target = gridBase.mouseTarget();
	switch (store.getState().PlacementSettings.BuildMode) {
		case "Place":
			if (target !== undefined) {
				buildHandle.ghostPart.Parent = Workspace;
				const pos = gridBase.mouseGridPosition();
				const tween = TweenService.Create(buildHandle.ghostPart, tweenInfo, {
					Position: pos,
				});
				buildHandle.ghostPart.Orientation = gridBase.getSmoothOrientation();
				tween.Play();
				tween.Completed.Wait();
				tween.Destroy();
				//buildHandle.placeOutline.Adornee = undefined;
			} else {
				buildHandle.ghostPart.Parent = undefined;
			}
			break;
		case "Delete":
			buildHandle.ghostPart.Parent = undefined;
			break;
	}
});

UserInputService.InputBegan.Connect((input, gameProcessed) => {
	const mode = store.getState().PlacementSettings.BuildMode;
	if (gameProcessed) return;
	switch (input.KeyCode) {
		case Enum.KeyCode.Q:
			switch (mode) {
				case "Spectate":
					updateMode("Place");
					buildHandle.updateGhostPart();
					break;
				case "Place":
					updateMode("Delete");
					break;
				case "Delete":
					updateMode("Spectate");
					break;
			}
		case Enum.KeyCode.R:
			gridBase.rotate();
			break;
		case Enum.KeyCode.T:
			gridBase.tilt();
			break;
		case Enum.KeyCode.F:
			buildHandle.previousBlockType();
			break;
		case Enum.KeyCode.G:
			buildHandle.nextBlockType();
			break;
	}
	if (input.UserInputType === Enum.UserInputType.MouseButton1) {
		switch (mode) {
			case "Place":
				buildHandle.placeBlock();
				break;
			case "Delete":
				buildHandle.deleteBlock();
		}
	}
});

store.changed.connect(() => buildHandle.updateGhostPart());
