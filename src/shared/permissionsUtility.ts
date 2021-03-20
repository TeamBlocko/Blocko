export const PermissionRanks: readonly PermissionTypes[] = [
	"Owner",
	"Admin",
	"Builder",
	"Visitor"
] as const

export function getUserPermissions(worldInfo: WorldInfo, userId: number): PermissionsInfo {
	const info = worldInfo.Permissions.find((info) => info.UserId === userId)
	if (info) {
		return info
	}

	return {
		UserId: userId,
		Type: worldInfo.Owner ? "Owner" : "Visitor",
	}
}

export function getRank(type: PermissionTypes): number {
	return PermissionRanks.size() - PermissionRanks.findIndex(permission => permission === type)
}

export function isUserBanned(worldInfo: WorldInfo, userId: number): boolean {
	return !worldInfo.Banned.find((id) => id === userId)
}

export function isPermed(worldInfo: WorldInfo, userId: number, type: PermissionTypes): boolean {
	return getRank(getUserPermissions(worldInfo, userId).Type) > getRank(type)
}