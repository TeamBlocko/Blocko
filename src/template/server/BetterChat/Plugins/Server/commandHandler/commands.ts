import { Players } from "@rbxts/services";
import { PermissionRanks, getUserRank, getRank, calculatePermissionsOfUser } from "template/shared/permissionsUtility";
import WorldManager from "template/server/WorldManager";
import { updateWorldPermission } from "template/shared/worldSettingsReducer";
import { constructMessage, errorMsg } from "./messageUtility";

export const PREFIX = "!";

export interface Arg {
	name: string;
	description: string;
}

export interface Command {
	name: string;
	args: Arg[];
	execute(caller: Player, ...args: string[]): string;
}

export const commands = {
	perm: identity<Command>({
		name: "Perm",
		args: [
			{ name: "Player", description: "The player you want to change the permission of." },
			{ name: "Permission Level", description: "The new permission level for the player." },
		],
		execute(caller, playerValue, permissionLevelValue) {
			const player = Players.GetPlayers().find(
				(player) => !!player.Name.lower().match(`^${playerValue.lower()}`)[0],
			);
			if (!player)
				return constructMessage(PREFIX, this, `Invalid value passed for Player`, this.args[0], playerValue);

			const stateInfo = WorldManager.store.getState().Info;
			const callerRank = getUserRank(stateInfo, caller.UserId);

			const permissionLevel = PermissionRanks.find(
				(permission) => !!permission.lower().match(`^${permissionLevelValue.lower()}`)[0],
			);
			if (!permissionLevel) {
				const validPermissionLevels = PermissionRanks.filter((_, index) => callerRank < index);
				const lastPermission = validPermissionLevels.pop();
				const permissions = `${validPermissionLevels.join(", ")}, and ${lastPermission}`;
				return constructMessage(
					PREFIX,
					this,
					`Invalid value passed for PermissionLevel${
						validPermissionLevels.size() !== 0 ? `, valid values include ${permissions}` : ""
					}`,
					this.args[1],
					permissionLevelValue,
				);
			}

			if (!calculatePermissionsOfUser(stateInfo, caller.UserId).ManagePermissions)
				return errorMsg(`You don't have permission to manage permissions`);

			if (callerRank >= getRank(permissionLevel))
				return errorMsg(`Your permission level is lower than the one you want to assign to ${player.Name}.`);

			if (callerRank >= getUserRank(stateInfo, player.UserId))
				return errorMsg(`${player.Name} has a higher permission level.`);
			print("SUCCESS UPDATED PERMISSION");
			WorldManager.store.dispatch(updateWorldPermission(player.UserId, permissionLevel));
			return `Successfully updated permission of ${player.Name} to ${permissionLevelValue}`;
		},
	}),
};

export function isValidCommand(command: string): command is keyof typeof commands {
	return !!commands[command as keyof typeof commands];
}
