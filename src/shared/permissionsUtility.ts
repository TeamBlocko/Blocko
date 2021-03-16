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

export function isUserBanned(worldInfo: WorldInfo, userId: number) {
	!worldInfo.Banned.find((id) => id === userId)
}