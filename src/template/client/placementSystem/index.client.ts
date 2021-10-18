import {
	Workspace,
	ReplicatedStorage,
	UserInputService,
	RunService,
	TweenService,
	Players,
	ContextActionService,
} from "@rbxts/services";
import { Client } from "@rbxts/net";
import store from "template/client/store";
import { gridBase } from "./GridBase";
import BuildHandle from "./BuildHandle";
import {
	updateProperty,
	UpdateBuildMode,
	UpdateBasePart,
	UpdatePropertyDataType,
} from "template/client/rodux/placementSettings";
import { calculatePermissionsOfUser, toOwnerAndPermissions } from "template/shared/permissionsUtility";
import { getTopPart, mouseTarget } from "template/shared/utility";

const client = Players.LocalPlayer;
const shapes = ReplicatedStorage.BlockTypes;

const getMouseTarget = new Client.AsyncFunction<[], [], unknown, BasePart | undefined>("MouseTarget");

const PARTIAL_COPY: Readonly<KeyCombo> = [Enum.KeyCode.LeftAlt] as const;
const FULL_COPY: Readonly<KeyCombo> = [Enum.KeyCode.LeftAlt, Enum.KeyCode.LeftControl] as const;

const ALT_PROPERTIES: (keyof RawProperties)[] = [
	"Material",
	"CastShadow",
	"Transparency",
	"Reflectance",
	"Color",
	"CanCollide",
];

const ALT_SHIFT_PROPERTIES: (keyof RawProperties)[] = [...ALT_PROPERTIES, "Size"];

const outlineTweenInfo = new TweenInfo(2.5);

const placeOutline = new Instance("SelectionBox");
placeOutline.Color3 = Color3.fromRGB(60, 164, 255);
placeOutline.Parent = Workspace;

const deleteOutline = new Instance("SelectionBox");
deleteOutline.Color3 = Color3.fromRGB(255, 80, 80);
deleteOutline.Parent = Workspace;

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
	const target = mouseTarget(gridBase.maxPlaceDistance, [gridBase.blocks]);
	const state = store.getState();
	switch (state.PlacementSettings.BuildMode) {
		case "Place":
			if (target !== undefined) {
				buildHandle.ghostPart.Parent = !state.ActivatedPicker ? Workspace : undefined;
				placeOutline.Adornee = !state.ActivatedPicker ? buildHandle.ghostPart : undefined;
				buildHandle.ghostPart.Orientation = gridBase.getSmoothOrientation();

				if (tween) {
					tween.Pause();
					tween.Destroy();
				}
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

			deleteOutline.Adornee = !state.ActivatedPicker ? target : undefined;
			break;
		case "Spectate":
			previousPosition = undefined;
			placeOutline.Adornee = undefined;
			buildHandle.ghostPart.Parent = undefined;

			deleteOutline.Adornee = undefined;
	}
});

type KeyCombo = Enum.KeyCode[];

function isKeyCombo(combo: Readonly<KeyCombo>): boolean {
	for (const key of combo) {
		if (!UserInputService.IsKeyDown(key)) {
			return false;
		}
	}
	return true;
}

function map_properties(target: BasePart): (propertyName: keyof RawProperties) => UpdatePropertyDataType {
	return (propertyName) => {
		const value = target[propertyName];
		return {
			propertyName,
			value,
		};
	};
}

ContextActionService.BindActionAtPriority(
	"PlacementSystemHandler",
	(_, inputState, inputObject) => {
		coroutine.wrap((): void => {
			if (inputState !== Enum.UserInputState.Begin) return;
			const state = store.getState();
			const mode = state.PlacementSettings.BuildMode;
			if (!calculatePermissionsOfUser(toOwnerAndPermissions(state.World.Info), client.UserId).Build) return;
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
					break;
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

			if (isKeyCombo(FULL_COPY)) {
				const target = mouseTarget(gridBase.maxPlaceDistance, [gridBase.blocks]);
				if (target === undefined) return;
				const properties = ALT_SHIFT_PROPERTIES.map(map_properties(target));
				store.dispatch(updateProperty(properties));
				store.dispatch(UpdateBasePart(shapes[target.Name as keyof typeof Shapes]));
			} else if (isKeyCombo(PARTIAL_COPY)) {
				const target = mouseTarget(gridBase.maxPlaceDistance, [gridBase.blocks]);
				if (target === undefined) return;
				const properties = ALT_PROPERTIES.map(map_properties(target));
				store.dispatch(updateProperty(properties));
			}

			if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
				if (state.ActivatedPicker) return;
				switch (mode) {
					case "Place":
						buildHandle.placeBlock();
						break;
					case "Delete":
						buildHandle.deleteBlock();
						break;
				}
			}
		})();
		return Enum.ContextActionResult.Pass;
	},
	false,
	2,
	...Enum.UserInputType.GetEnumItems(),
);

store.changed.connect(() => buildHandle.updateGhostPart());

getMouseTarget.SetCallback(() => getTopPart(gridBase.maxPlaceDistance));
