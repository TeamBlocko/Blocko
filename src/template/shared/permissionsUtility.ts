import { GroupService } from "@rbxts/services";
import { assign } from "@rbxts/object-utils";
import RolePermissions from "./permissions";

export const PermissionRanks: readonly PermissionTypes[] = [
	"TeamBlocko",
	"Owner",
	"Admin",
	"Builder",
	"Visitor",
] as const;

export function teamBlockoStaff(userId: number): PermissionsInfo | undefined {
	const result = opcall(() => GroupService.GetGroupsAsync(userId).find((group) => group.Id === 6467229));
	if (result.success && (result.value?.Rank ?? 0) >= 252) {
		return {
			UserId: userId,
			Type: "TeamBlocko",
		};
	}
}

export function getUserPermissions(worldInfo: WorldInfo, userId: number, staff?: boolean): PermissionsInfo {
	if (staff) {
		const result = teamBlockoStaff(userId);
		if (result) return result;
	}

	const info = worldInfo.Permissions.find((info) => info.UserId === userId);
	if (info !== undefined) {
		return info;
	}

	return {
		UserId: userId,
		Type: worldInfo.Owner === userId ? "Owner" : "Visitor",
	};
}

export function calculatePermissions(role: PermissionTypes): Omit<Permissions, "Inherit"> {
	const rolePermission = RolePermissions[role];
	return assign({}, rolePermission, rolePermission.Inherit ? calculatePermissions(rolePermission.Inherit) : {});
}

export function calculatePermissionsOfUser(worldInfo: WorldInfo, userId: number) {
	return calculatePermissions(getUserPermissions(worldInfo, userId).Type);
}

export function getRank(role: PermissionTypes): number {
	return PermissionRanks.findIndex((permission) => permission === role);
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

export function getPlayersWithPerm(worldInfo: WorldInfo, perm: PermissionNames, players: Player[]): Player[] {
	return players.filter((player) => calculatePermissionsOfUser(worldInfo, player.UserId)[perm]);
}
