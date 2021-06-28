import { Workspace, UserInputService, TweenService } from "@rbxts/services";
import store from "template/client/store";

const camera = Workspace.CurrentCamera;

interface Target extends BasePart {
	ActualSize: Vector3Value;
}

type Axis = "X" | "Y" | "Z";

type Info = [Axis, number];

interface RotationDataType {
	[key: string]: ([...Info, Vector3] | [Info, Info, Vector3])[];
}

interface RaycastResult {
	Instance: Target;
	Position: Vector3;
	Normal: Vector3;
}

const FIXED: RotationDataType = {
	"422": [
		[["Z", 90], ["Y", 90], new Vector3(2, 4, 2)],
		["Z", 90, new Vector3(2, 4, 2)],
		["Y", 90, new Vector3(2, 2, 4)],
	],
	"224": [
		[["X", 90], ["Y", 90], new Vector3(2, 4, 2)],
		["Y", 90, new Vector3(4, 2, 2)],
		["X", 90, new Vector3(2, 4, 2)]	
	],
	"242": [
		[["X", 90], ["Y", 90], new Vector3(4, 2, 2)],
		[["Z", 90], ["Y", 90], new Vector3(2, 2, 4)],
		["Z", 90, new Vector3(4, 2, 2)],
		["X", 90, new Vector3(2, 2, 4)],
	],
	"442": [
		[["X", 90], ["Y", 90], new Vector3(4, 2, 4)],
		["Y", 90, new Vector3(2, 4, 4)],
		["X", 90, new Vector3(4, 2, 4)]
	],
	"244": [
		[["Y", 90], ["Z", 90], new Vector3(4, 2, 4)],
		["Y", 90, new Vector3(4, 4, 2)],
		["Z", 90, new Vector3(4, 2, 4)],
	],
	"424": [
		[["Y", 90], ["Z", 90], new Vector3(4, 4, 2)],
		[["X", 90], ["Y", 90], new Vector3(4, 4, 2)],
		["Z", 90, new Vector3(2, 4, 4)],
		["X", 90, new Vector3(4, 4, 2)],
	],
};

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
	private normals: Vector3[] = [];

	private rotation = new CFrame();
	private rawRotation = new Vector3();
	private smoothCheatPart = new Instance("Part");

	constructor(options: GridBaseOptions) {
		this.blocks = options.Blocks;
		this.maxPlaceDistance = options.MaxPlaceDistance ?? DEFAULT_OPTIONS.MaxPlaceDistance;
		this.rotationTweenInfo = options.RotationTweenInfo ?? DEFAULT_OPTIONS.RotationTweenInfo;

		for (const normalId of Enum.NormalId.GetEnumItems()) {
			this.normals.push(Vector3.FromNormalId(normalId));
		}
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

	private valid(vector: Vector3) {
		const validAxis: Axis[] = [];

		if (vector.X !== 0) {
			validAxis.push("X");
		}
		if (vector.Y !== 0) {
			validAxis.push("Y");
		}
		if (vector.Z !== 0) {
			validAxis.push("Z");
		}

		return validAxis;
	}

	private negative(vector: Vector3) {
		if (vector.X < 0) {
			return true;
		} else if (vector.Y < 0) {
			return true;
		} else if (vector.Z < 0) {
			return true;
		}
	}

	getFixed(vector: Vector3, part?: Part): Vector3 {
		const currentOrientation = this.getOrientation() // part ? part.Orientation : this.rawRotation;

		const id = [vector.X, vector.Y, vector.Z].join("");
		if (FIXED[id] !== undefined) {
			for (const rotationInfo of FIXED[id]) {
				if (typeIs(rotationInfo[1], "table") === true) {
					let validToChange = true;
					for (const additionalInfo of rotationInfo) {
						if (typeIs(additionalInfo, "table") !== true) {
							break;
						}
						const axis: Axis = (additionalInfo as Info)[0];
						if (currentOrientation[axis] % 180 !== (additionalInfo as Info)[1]) {
							validToChange = false;
						}
					}

					if (validToChange === true) {
						vector = rotationInfo[2];
						break;
					}
				} else {
					const axis: Axis = (rotationInfo as [...Info, Vector3])[0];
					if (currentOrientation[axis] % 180 === rotationInfo[1]) {
						vector = rotationInfo[2];
						break;
					}
				}
			}
		}

		return vector;
	}

	getSurface(normal: Vector3, isFloatError?: boolean) {
		const sign = isFloatError ? 1 : -1;

		let closest = new Vector3(1, 1, 1).mul(100);
		for (const surfaceNormal of this.normals) {
			if (closest !== undefined) {
				if (surfaceNormal.sub(normal).Magnitude * sign > closest.sub(normal).Magnitude * sign) {
					closest = surfaceNormal;
				}
			}
		}

		return closest;
	}

	updateGridCells(target: Target, normal: Vector3, isFloatError?: boolean) {
		this.buildCache.set(target, new Map());
		const cacheNormals = this.buildCache.get(target);
		if (cacheNormals === undefined) return;

		cacheNormals.set(tostring(normal), []);
		const normalCells = cacheNormals.get(tostring(normal));
		if (normalCells === undefined) return;

		const actualSize = target.FindFirstChild("ActualSize") ? target.ActualSize.Value : target.Size;
		if (actualSize === undefined) return;

		const sign = isFloatError ? -1 : 1;
		const opposite = this.negative(normal) ? new Vector3(1, 1, 1).add(normal) : new Vector3(1, 1, 1).sub(normal);
		const targetSize = this.getFixed(actualSize);

		const edge = target.Position.add(targetSize.div(2).mul(normal)).add(targetSize.div(2).mul(opposite));

		const validFound = this.valid(opposite);
		const size = this.getFixed(store.getState().PlacementSettings.RawProperties.Size);

		const pos = edge.add(size.div(2).mul(normal).mul(sign)).sub(size.div(2).mul(opposite));

		const firstAxis = validFound[0];
		for (let column = 0; column <= math.abs(targetSize[firstAxis] - size[firstAxis]) / 2; column++) {
			const secondAxis = validFound[1];
			const firstAxisSize = Vector3.FromAxis(Enum.Axis[firstAxis]).mul(size).mul(column);

			for (let row = 0; row <= math.abs(targetSize[secondAxis] - size[secondAxis]) / 2; row++) {
				const secondAxisSize = Vector3.FromAxis(Enum.Axis[secondAxis]).mul(size).mul(row);
				const position = pos.sub(firstAxisSize).sub(secondAxisSize);
				const finalPosition = target.CFrame.Inverse().mul(new CFrame(position));

				normalCells.push(target.CFrame.mul(finalPosition));
			}
		}
	}

	clearBuildCache() {
		this.buildCache = new Map();
	}

	getClosest(target: Target, pos: Vector3, normal: Vector3) {
		let closest = new CFrame(new Vector3(1, 1, 1).mul(100));
		const normalCells = this.buildCache.get(target)?.get(tostring(normal));
		if (normalCells === undefined) return;

		for (const cell of normalCells) {
			if (closest.Position.sub(pos).Magnitude > cell.Position.sub(pos).Magnitude) {
				closest = cell;
			}
		}

		return closest.Position;
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

	getClosestCellFromRaycast(raycastResult: RaycastResult) {
		if (this.normals.indexOf(raycastResult.Normal) !== -1) {
			this.updateGridCells(raycastResult.Instance, raycastResult.Normal);
			return this.getClosest(raycastResult.Instance, raycastResult.Position, raycastResult.Normal);
		} else {
			const isFromFloatError = this.isFromFloatError(raycastResult.Normal);
			const normal = this.getSurface(raycastResult.Normal, isFromFloatError);
			this.updateGridCells(raycastResult.Instance, normal, isFromFloatError);
			return this.getClosest(raycastResult.Instance, raycastResult.Position, normal);
		}
	}

	mouseGridPosition() {
		const raycastResult = (this.raycastMouse() as unknown) as RaycastResult;

		if (raycastResult !== undefined) {
			return this.getClosestCellFromRaycast(raycastResult);
		}
	}

	rotate() {
		this.rawRotation = new Vector3(0, (this.rawRotation.Y + 90) % 360, this.rawRotation.Z);
		this.rotation = this.rotation.mul(CFrame.Angles(0, math.pi / 2, 0));
		TweenService.Create(this.smoothCheatPart, this.rotationTweenInfo, {
			CFrame: this.rotation,
		}).Play();
	}

	tilt() {
		this.rawRotation = new Vector3(0, this.rawRotation.Y, (this.rawRotation.Z + 90) % 360);
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
