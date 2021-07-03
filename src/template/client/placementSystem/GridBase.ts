import { Workspace, UserInputService, TweenService } from "@rbxts/services";
import store from "template/client/store";

const camera = Workspace.CurrentCamera;

type Axis = "X" | "Y" | "Z";

interface Target extends BasePart {
	ActualSize: Vector3Value;
}

interface GridBaseOptions {
	Blocks: Instance;
	MaxPlaceDistance?: number;
	RotationTweenInfo?: TweenInfo;
}

const DEFAULT_OPTIONS = {
	MaxPlaceDistance: 100,
	RotationTweenInfo: new TweenInfo(0.1),
};

class GridBase {
	public readonly blocks: Instance;
	public readonly maxPlaceDistance: number;
	public readonly rotationTweenInfo: TweenInfo;

	private buildCache = new Map<Target, Map<string, CFrame[]>>();

	private rotation = new CFrame();
	private smoothCheatPart = new Instance("Part");

	constructor(options: GridBaseOptions) {
		this.blocks = options.Blocks;
		this.maxPlaceDistance = options.MaxPlaceDistance ?? DEFAULT_OPTIONS.MaxPlaceDistance;
		this.rotationTweenInfo = options.RotationTweenInfo ?? DEFAULT_OPTIONS.RotationTweenInfo;

	}

	numberToGrid(num: number, gridSize: number) {
		return math.floor(num/gridSize+0.5)*gridSize
	}

	clampNum(num: number) {
		return num%2 === 0 ? num + 1 : num
	}

	getSize(size: Vector3) {
		const orientation = this.getOrientation();
		if (size === new Vector3(2, 2, 4)) {
			if (orientation.Y%180 === 90 && orientation.X%180 === 90) {
				return new Vector3(2, 4, 2)
			} else if (orientation.Y%180 === 90) {
				return new Vector3(4, 2, 2)
			}
		} else if (size === new Vector3(4, 2, 2)) {
			if (orientation.X%180 === 90 && orientation.Z%180 === 90) {
				return new Vector3(2, 2, 4)
			} else if (orientation.Y%180 === 90 && orientation.Z%180 === 90) {
				return new Vector3(4, 2, 2)
			} else if (orientation.Z%180 === 90) {
				return new Vector3(2, 4, 2)
			} else if (orientation.Y%180 === 90) {
				return new Vector3(2, 2, 4)
			}
		} else if (size === new Vector3(2, 4, 2)) {
			if (orientation.X%180 === 90 && orientation.Y%180 === 90) {
				return new Vector3(4, 2, 2)
			} else if (orientation.Y%180 === 90 && orientation.Z%180 === 90) {
				return new Vector3(2, 2, 4)
			} else if (orientation.Z%180 === 90) {
				return new Vector3(4, 2, 2)
			}
		} else if (size === new Vector3(2, 4, 4)) {
			if (orientation.X%180 === 90 && orientation.Z%180 === 90) {
				return new Vector3(4, 4, 2)
			} else if (orientation.Y%180 === 90 && orientation.Z%180 === 90) {
				return new Vector3(4, 2, 4)
			} else if (orientation.Z%180 === 90) {
				return new Vector3(4, 2, 4)
			} else if (orientation.Y%180 === 90) {
				return new Vector3(4, 4, 2)
			}
		} else if (size === new Vector3(4, 2, 4)) {
			if (orientation.X%180 === 90 && orientation.Y%180 === 90) {
				return new Vector3(2, 4, 4)
			} else if (orientation.Y%180 === 90 && orientation.Z%180 === 90) {
				return new Vector3(4, 4, 2)
			} else if (orientation.Z%180 === 90) {
				return new Vector3(2, 4, 4)
			}
		} else if (size === new Vector3(4, 4, 2)) {
			if (orientation.X%180 === 90 && orientation.Y%180 === 90) {
				return new Vector3(4, 2, 4)
			} else if (orientation.Y%180 === 90 && orientation.Z%180 === 90) {
				return new Vector3(2, 4, 4)
			} else if (orientation.X%180 === 90) {
				return new Vector3(2, 4, 4)
			}
		}
		return size
	}

	positionToGrid(vector: Vector3): Vector3 {
		const size = this.getSize(store.getState().PlacementSettings.RawProperties.Size);
		
		const x = size.X === 2 ? this.clampNum(this.numberToGrid(vector.X, 1)) : this.numberToGrid(vector.X, 4)
		const y = size.Y === 2 ? this.clampNum(this.numberToGrid(vector.Y, 1)) : this.numberToGrid(vector.Y, 4)
		const z = size.Z === 2 ? this.clampNum(this.numberToGrid(vector.Z, 1)) : this.numberToGrid(vector.Z, 4)
		return new Vector3(x, y, z)
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

	mouseTarget() {
		const raycastResult = this.raycastMouse();
		return raycastResult && raycastResult.Instance;
	}

	mousePosition() {
		const raycastResult = this.raycastMouse();
		return raycastResult && raycastResult.Position;	
	}

	mouseBlockSide() {
		const ray = this.raycastMouse();
		if (!ray) return;
		const offset = ray.Position.sub(ray.Instance.Position)
		let lNum = 0;
		let largestAxis: Axis = "X";
		for (const axis of ["X", "Y", "Z"] as const) {
			let value = offset[axis];
			if (math.abs(value) >= lNum) {
				lNum = math.abs(value)
				largestAxis = axis
			}
		}
		switch (largestAxis) {
			case "X":
				return new Vector3(offset.X, 0, 0).Unit
			case "Y":
				return new Vector3(0, offset.Y, 0).Unit
			case "Z":
				return new Vector3(0, 0, offset.Z).Unit
		}
	}

	mouseGridPosition() {
		const target = this.mouseTarget();
		const pos = this.mousePosition();
		if (!pos) return;
		if (!target) return this.positionToGrid(pos)
		const normal = this.mouseBlockSide();
		if (!normal) return;
		const result = this.positionToGrid(pos.add(normal));
		return result
	}

	clearBuildCache() {
		this.buildCache = new Map();
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

export default GridBase;
