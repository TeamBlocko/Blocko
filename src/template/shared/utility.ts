import { UserInputService, Workspace } from "@rbxts/services";

const camera = Workspace.CurrentCamera;

export function raycastMouse(maxDistance: number, include: Instance[]) {
	if (camera === undefined) return;
	const raycastParams = new RaycastParams();
	raycastParams.FilterType = Enum.RaycastFilterType.Whitelist;
	raycastParams.FilterDescendantsInstances = include;

	const mousePos = UserInputService.GetMouseLocation();
	const mouseUnitRay = camera.ScreenPointToRay(mousePos.X, mousePos.Y - 36);
	return Workspace.Raycast(mouseUnitRay.Origin, mouseUnitRay.Direction.mul(maxDistance), raycastParams);
}

export function raycastMouseOptions(origin: Vector3, direction: Vector3, include: Instance[]) {
	if (camera === undefined) return;
	const raycastParams = new RaycastParams();
	raycastParams.FilterType = Enum.RaycastFilterType.Whitelist;
	raycastParams.FilterDescendantsInstances = include;

	return Workspace.Raycast(origin, direction, raycastParams);
}

export function mouseTarget(maxDistance: number, include: Instance[]) {
	const raycastResult = raycastMouse(maxDistance, include);
	return raycastResult && raycastResult.Instance;
}

export function mousePosition(maxDistance: number, include: Instance[]) {
	const raycastResult = raycastMouse(maxDistance, include);
	return raycastResult && raycastResult.Position;
}

export function mouseBlockSide(maxDistance: number, include: Instance[]) {
	const ray = raycastMouse(maxDistance, include);
	if (!ray) return;
	return ray.Normal;
}


export function getTopPart(maxDistance: number): BasePart | undefined {
	const target = mouseTarget(maxDistance, [Workspace.Blocks]);
	if (!target) return;
	let part = target;
	while (true) {
		const result = raycastMouseOptions(part.Position, new Vector3(0, 5, 0), [Workspace.Blocks, part]);
		if (result) {
			part = result.Instance;
			continue;
		}
		break;
	}
	return part;
}