import {
	Workspace,
	ReplicatedStorage,
	UserInputService,
	RunService,
	TweenService,
	Players,
	ContextActionService,
} from "@rbxts/services";
import store from "template/client/store";
import GridBase from "./GridBase";
import BuildHandle from "./BuildHandle";
import { updateProperty, UpdateBuildMode, UpdateBasePart } from "template/client/rodux/placementSettings";

const client = Players.LocalPlayer;
const playerGui = client.WaitForChild("PlayerGui");
const shapes = ReplicatedStorage.BlockTypes;

const SPECTATE_COLOR = Color3.fromRGB(255, 255, 255),
	BUILD_COLOR = Color3.fromRGB(65, 179, 255),
	DELETE_COLOR = Color3.fromRGB(255, 110, 110);

const ALT_PROPERTIES: (keyof RawProperties)[] = ["Material", "CastShadow", "Transparency", "Reflectance", "Color"];

const ALT_SHIFT_PROPERTIES: (keyof RawProperties)[] = [...ALT_PROPERTIES, "Size"];

const outlineTweenInfo = new TweenInfo(2.5);

const placeOutline = new Instance("SelectionBox");
placeOutline.Color3 = Color3.fromRGB(60, 164, 255);
placeOutline.Parent = Workspace;

const deleteOutline = new Instance("SelectionBox");
deleteOutline.Color3 = Color3.fromRGB(255, 80, 80);
deleteOutline.Parent = Workspace;

const gridBase = new GridBase({
	Blocks: Workspace.Blocks,
	MaxPlaceDistance: 1e3,
	RotationTweenInfo: new TweenInfo(0.25, Enum.EasingStyle.Quint),
});

const buildHandle = new BuildHandle(gridBase, shapes);

const tweenInfo = new TweenInfo(0.1, Enum.EasingStyle.Quint);

function tweenOutlines(selection: SelectionBox, colors: Color3[]) {
	coroutine.wrap(() => {
		while (true) {
			for (const color of colors) {
				const tween = TweenService.Create(selection, outlineTweenInfo, { Color3: color });
				tween.Play();
				tween.Completed.Wait();
			}
		}
	})();
}

function updateMode(newMode: BuildMode) {
	store.dispatch(UpdateBuildMode(newMode));
}

tweenOutlines(placeOutline, [Color3.fromRGB(60, 164, 255), Color3.fromRGB(161, 211, 255)]);
tweenOutlines(deleteOutline, [Color3.fromRGB(255, 80, 80), Color3.fromRGB(255, 145, 145)]);

let tween: TweenBase | undefined;
let previousPosition: Vector3 | undefined;

RunService.RenderStepped.Connect(() => {
	const target = gridBase.mouseTarget();
	const state = store.getState();
	switch (state.PlacementSettings.BuildMode) {
		case "Place":
			if (target !== undefined) {
				buildHandle.ghostPart.Parent = !state.ActivatedColorPicker ? Workspace : undefined;
				placeOutline.Adornee = !state.ActivatedColorPicker ? buildHandle.ghostPart : undefined;
				buildHandle.ghostPart.Orientation = gridBase.getSmoothOrientation();

				if (tween === undefined) {
					const pos = gridBase.mouseGridPosition();
					if (pos !== undefined) {
						if (previousPosition !== undefined) {
							tween = TweenService.Create(buildHandle.ghostPart, tweenInfo, {
								Position: pos,
							});
							tween.Play();
							tween.Completed.Connect(() => {
								tween!.Destroy();
								tween = undefined;
							});
							previousPosition = pos;
						} else {
							buildHandle.ghostPart.Position = pos;
							previousPosition = pos;
						}
					}
				}
			} else {
				previousPosition = undefined;
				buildHandle.ghostPart.Parent = undefined;
				placeOutline.Adornee = undefined;
			}
			break;
		case "Delete":
			previousPosition = undefined;
			placeOutline.Adornee = undefined;
			buildHandle.ghostPart.Parent = undefined;

			deleteOutline.Adornee = !state.ActivatedColorPicker ? target : undefined;
			break;
		case "Spectate":
			previousPosition = undefined;
			placeOutline.Adornee = undefined;
			buildHandle.ghostPart.Parent = undefined;

			deleteOutline.Adornee = undefined;
	}
});

ContextActionService.BindActionAtPriority(
	"PlacementSystemHandler",
	(_, inputState, inputObject) => {
		if (inputState !== Enum.UserInputState.Begin) return Enum.ContextActionResult.Pass;
		const mode = store.getState().PlacementSettings.BuildMode;
		const state = store.getState();
		if (state.World.Info.Owner !== client.UserId) return Enum.ContextActionResult.Pass;
		switch (inputObject.KeyCode) {
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
			case Enum.KeyCode.LeftAlt:
				if (UserInputService.IsKeyDown(Enum.KeyCode.LeftShift)) {
					const target = gridBase.mouseTarget();
					if (target === undefined) break;
					const properties = ALT_SHIFT_PROPERTIES.map((propertyName) => ({
						propertyName,
						value: target[propertyName],
					}));
					store.dispatch(updateProperty(properties));
					store.dispatch(UpdateBasePart(shapes[target.Name as keyof typeof Shapes]));
				} else {
					const target = gridBase.mouseTarget();
					if (target === undefined) break;
					const properties = ALT_PROPERTIES.map((propertyName) => ({
						propertyName,
						value: target[propertyName],
					}));
					store.dispatch(updateProperty(properties));
				}
				break;
		}
		if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
			if (state.ActivatedColorPicker) return Enum.ContextActionResult.Pass;
			switch (mode) {
				case "Place":
					buildHandle.placeBlock();
					break;
				case "Delete":
					buildHandle.deleteBlock();
			};
		}
		return Enum.ContextActionResult.Pass;
	},
	false,
	2,
	...Enum.UserInputType.GetEnumItems(),
);

store.changed.connect(() => buildHandle.updateGhostPart());
