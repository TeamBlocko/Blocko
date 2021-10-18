import { Workspace, UserInputService, TweenService } from "@rbxts/services";
import store from "template/client/store";
import { mouseBlockSide, mousePosition, mouseTarget } from "template/shared/utility";

const camera = Workspace.CurrentCamera;

interface GridBaseOptions {
	Blocks: Instance;
	MaxPlaceDistance?: number;
	RotationTweenInfo?: TweenInfo;
}

const DEFAULT_OPTIONS = {
	MaxPlaceDistance: 100,
	RotationTweenInfo: new TweenInfo(0.1),
};

export class GridBase {
	public readonly blocks: Instance;
	public readonly maxPlaceDistance: number;
	public readonly rotationTweenInfo: TweenInfo;

	private rotation = new CFrame();
	private smoothCheatPart = new Instance("Part");

	constructor(options: GridBaseOptions) {
		this.blocks = options.Blocks;
		this.maxPlaceDistance = options.MaxPlaceDistance ?? DEFAULT_OPTIONS.MaxPlaceDistance;
		this.rotationTweenInfo = options.RotationTweenInfo ?? DEFAULT_OPTIONS.RotationTweenInfo;
	}

	numberToGrid(num: number, gridSize: number) {
		return math.floor(num / gridSize + 0.5) * gridSize;
	}

	clampNum(num: number, num2: number) {
		if (num % 2 === 0) {
			if (num - num2 > 0) return num - 1;
			return num + 1;
		}
		return num;
	}

	getSize(size: Vector3) {
		const orientation = this.getOrientation();
		if (size === new Vector3(2, 2, 4)) {
			if (orientation.X % 180 === 90) {
				return new Vector3(2, 4, 2);
			} else if (orientation.Y % 180 === 90) {
				return new Vector3(4, 2, 2);
			}
		} else if (size === new Vector3(4, 2, 2)) {
			if (orientation.X % 180 === 90 && orientation.Y % 180 === 90) {
				return new Vector3(2, 2, 4);
			} else if (orientation.Y % 180 === 90 && orientation.Z % 180 === 90) {
				return new Vector3(2, 4, 2);
			} else if (orientation.Z % 180 === 90) {
				return new Vector3(2, 4, 2);
			} else if (orientation.Y % 180 === 90) {
				return new Vector3(2, 2, 4);
			}
		} else if (size === new Vector3(2, 4, 2)) {
			if (orientation.X % 180 === 90 && orientation.Y % 180 === 90) {
				return new Vector3(4, 2, 2);
			} else if (orientation.Y % 180 === 90 && orientation.Z % 180 === 90) {
				return new Vector3(2, 2, 4);
			} else if (orientation.Z % 180 === 90) {
				return new Vector3(4, 2, 2);
			} else if (orientation.X % 180 === 90) {
				return new Vector3(2, 2, 4);
			}
		} else if (size === new Vector3(2, 4, 4)) {
			if (orientation.X % 180 === 90 && orientation.Z % 180 === 90) {
				return new Vector3(4, 4, 2);
			} else if (orientation.Y % 180 === 90 && orientation.Z % 180 === 90) {
				return new Vector3(4, 2, 4);
			} else if (orientation.Z % 180 === 90) {
				return new Vector3(4, 2, 4);
			} else if (orientation.Y % 180 === 90) {
				return new Vector3(4, 4, 2);
			}
		} else if (size === new Vector3(4, 2, 4)) {
			if (orientation.X % 180 === 90 && orientation.Y % 180 === 90) {
				return new Vector3(2, 4, 4);
			} else if (orientation.Y % 180 === 90 && orientation.Z % 180 === 90) {
				return new Vector3(4, 4, 2);
			} else if (orientation.Z % 180 === 90) {
				return new Vector3(2, 4, 4);
			} else if (orientation.X % 180 === 90) {
				return new Vector3(4, 4, 2);
			}
		} else if (size === new Vector3(4, 4, 2)) {
			if (orientation.X % 180) {
				return new Vector3(4, 2, 4);
			} else if (orientation.Y % 180 === 90 && orientation.Z % 180 === 90) {
				return new Vector3(2, 4, 4);
			} else if (orientation.Y % 180 === 90) {
				return new Vector3(2, 4, 4);
			}
		}
		return size;
	}

	positionToGrid(vector: Vector3, size: Vector3): Vector3 {
		const x =
			size.X === 2 ? this.clampNum(this.numberToGrid(vector.X, 1), vector.X) : this.numberToGrid(vector.X, 4);
		const y =
			size.Y === 2 ? this.clampNum(this.numberToGrid(vector.Y, 1), vector.Y) : this.numberToGrid(vector.Y, 4);
		const z =
			size.Z === 2 ? this.clampNum(this.numberToGrid(vector.Z, 1), vector.Z) : this.numberToGrid(vector.Z, 4);
		return new Vector3(x, y, z);
	}

	raycastMouse() {
		if (camera === undefined) return;
		const raycastParams = new RaycastParams();
		raycastParams.FilterType = Enum.RaycastFilterType.Whitelist;
		raycastParams.FilterDescendantsInstances = [this.blocks];

		const mousePos = UserInputService.GetMouseLocation();
		const mouseUnitRay = camera.ScreenPointToRay(mousePos.X, mousePos.Y - 36);
		return Workspace.Raycast(mouseUnitRay.Origin, mouseUnitRay.Direction.mul(this.maxPlaceDistance), raycastParams);
	}

	raycastMouseOptions(origin: Vector3, direction: Vector3, ignore: Instance) {
		if (camera === undefined) return;
		const raycastParams = new RaycastParams();
		raycastParams.FilterType = Enum.RaycastFilterType.Whitelist;
		raycastParams.FilterDescendantsInstances = [this.blocks, ignore];

		return Workspace.Raycast(origin, direction, raycastParams);
	}

	isAllFloat(vector: Vector3) {
		for (const axis of ["X", "Y", "Z"] as const) {
			if (math.floor(vector[axis]) === vector[axis]) {
				return false;
			}
		}
		return true;
	}

	isFloatError(value: number) {
		if (value === 1 || value === 0) {
			return true;
		}

		if (value * 1e4 < 1) {
			return true;
		}
	}

	isFromFloatError(vector: Vector3) {
		if (this.isFloatError(math.abs(vector.X)) === true) {
			return true;
		} else if (this.isFloatError(math.abs(vector.Y)) === true) {
			return true;
		} else if (this.isFloatError(math.abs(vector.Z)) === true) {
			return true;
		}
	}

	mouseGridPosition() {
		const target = mouseTarget(this.maxPlaceDistance, [this.blocks]);
		const pos = mousePosition(this.maxPlaceDistance, [this.blocks]);
		if (!pos) return;
		const gridSize = this.getSize(store.getState().PlacementSettings.RawProperties.Size);
		if (!target) return this.positionToGrid(pos, gridSize);
		const normal = mouseBlockSide(this.maxPlaceDistance, [this.blocks]);
		if (!normal) return;
		if (this.isAllFloat(normal) && !this.isFromFloatError(normal)) return this.positionToGrid(pos, gridSize);
		/*
		const offset = pos.sub(target.Position).mul(normal).Magnitude;
		const offsetX = gridSize.X / 2 - offset;
		const offsetY = gridSize.Y / 2 - offset;
		const offsetZ = gridSize.Z / 2 - offset;
		const vectorOffset = new Vector3(offsetX, offsetY, offsetZ).mul(normal);
		const blockPos = target.Position.add(vectorOffset).add(normal.div(2));
		*/
		const result = this.positionToGrid(pos.add(normal), gridSize);
		return result;
	}

	resetOrientation() {
		this.rotation = new CFrame();
		this.smoothCheatPart.CFrame = this.rotation;
	}

	rotate() {
		this.rotation = this.rotation.mul(CFrame.Angles(0, math.pi / 2, 0));
		TweenService.Create(this.smoothCheatPart, this.rotationTweenInfo, {
			CFrame: this.rotation,
		}).Play();
	}

	tilt() {
		this.rotation = this.rotation.mul(CFrame.Angles(0, 0, math.pi / 2));
		TweenService.Create(this.smoothCheatPart, this.rotationTweenInfo, {
			CFrame: this.rotation,
		}).Play();
	}

	getOrientation() {
		const cheatPart = new Instance("Part");
		cheatPart.CFrame = this.rotation;
		return cheatPart.Orientation;
	}

	getSmoothOrientation() {
		return this.smoothCheatPart.Orientation;
	}
}

export const gridBase = new GridBase({
	Blocks: Workspace.Blocks,
	MaxPlaceDistance: 1e5,
	RotationTweenInfo: new TweenInfo(0.25, Enum.EasingStyle.Quint),
});
