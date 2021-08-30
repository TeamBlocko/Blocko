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

const cache = new Map<number, PermissionsInfo>();

interface OwnerAndPermissions {
	Owner: number;
	Permissions: PermissionsInfo[];
	Bans: number[];
}

export const toOwnerAndPermissions = (worldInfo: WorldInfo): OwnerAndPermissions => {
	return {
		Owner: worldInfo.Owner,
		Permissions: worldInfo.Permissions,
		Bans: worldInfo.Banned,
	};
};

export function teamBlockoStaff(userId: number): PermissionsInfo | undefined {
	const cached = cache.get(userId);
	if (cached) return cached;
	const result = opcall(() => GroupService.GetGroupsAsync(userId).find((group) => group.Id === 6467229));
	if (result.success && (result.value?.Rank ?? 0) >= 252) {
		const info: PermissionsInfo = {
			UserId: userId,
			Type: "TeamBlocko",
		};
		cache.set(userId, info);
		return info;
	}
}

export function getUserPermissions(
	ownerAndPermissions: OwnerAndPermissions,
	userId: number,
	staff?: boolean,
): PermissionsInfo {
	if (staff) {
		const result = teamBlockoStaff(userId);
		if (result) return result;
	}

	const info = ownerAndPermissions.Permissions.find((info) => info.UserId === userId);
	if (info !== undefined) {
		return info;
	}

	return {
		UserId: userId,
		Type: ownerAndPermissions.Owner === userId ? "Owner" : "Visitor",
	};
}

export function calculatePermissions(role: PermissionTypes): Omit<Permissions, "Inherit"> {
	const rolePermission = RolePermissions[role];
	return assign({}, rolePermission, rolePermission.Inherit ? calculatePermissions(rolePermission.Inherit) : {});
}

export function calculatePermissionsOfUser(ownerAndPermissions: OwnerAndPermissions, userId: number) {
	return calculatePermissions(getUserPermissions(ownerAndPermissions, userId, true).Type);
}

export function getRank(role: PermissionTypes): number {
	return PermissionRanks.findIndex((permission) => permission === role);
}

export function getUserRank(ownerAndPermissions: OwnerAndPermissions, userId: number): number {
	return getRank(getUserPermissions(ownerAndPermissions, userId).Type);
}

export function isUserBanned(ownerAndPermissions: OwnerAndPermissions, userId: number): boolean {
	return !ownerAndPermissions.Bans.find((id) => id === userId);
}

export function isPermed(ownerAndPermissions: OwnerAndPermissions, userId: number, role: PermissionTypes): boolean {
	return getRank(getUserPermissions(ownerAndPermissions, userId).Type) > getRank(role);
}

export function getPlayersWithPerm(
	ownerAndPermissions: OwnerAndPermissions,
	perm: PermissionNames,
	players: Player[],
): Player[] {
	return players.filter((player) => calculatePermissionsOfUser(ownerAndPermissions, player.UserId)[perm]);
}
