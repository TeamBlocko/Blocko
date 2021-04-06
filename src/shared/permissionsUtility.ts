export const PermissionRanks: readonly PermissionTypes[] = ["Owner", "Admin", "Builder", "Visitor"] as const;

export function getUserPermissions(worldInfo: WorldInfo, userId: number): PermissionsInfo {
	const info = worldInfo.Permissions.find((info) => info.UserId === userId);
	if (info !== undefined) {
		return info;
	}

	return {
		UserId: userId,
		Type: worldInfo.Owner === userId ? "Owner" : "Visitor",
	};
}

export function getRank(role: PermissionTypes): number {
	return PermissionRanks.size() - PermissionRanks.findIndex((permission) => permission === role);
}

export function getUserRank(worldInfo: WorldInfo, userId: number): number {
	return getRank(getUserPermissions(worldInfo, userId).Type);
}

export function isUserBanned(worldInfo: WorldInfo, userId: number): boolean {
	return !worldInfo.Banned.find((id) => id === userId);
}

export function isPermed(worldInfo: WorldInfo, userId: number, role: PermissionTypes): boolean {
	return getRank(getUserPermissions(worldInfo, userId).Type) > getRank(role);
}
