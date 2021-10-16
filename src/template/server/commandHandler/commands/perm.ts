import { t } from "@rbxts/t";
import { remotes } from "common/shared/remotes";
import type { Command, NonOptionalArg } from "../types";
import { constructMessage, errorMsg, getPlayerArg, successMsg } from "../utility";
import WorldManager from "../../WorldManager";
import {
	calculatePermissionsOfUser,
	getRank,
	getUserRank,
	PermissionRanks,
	toOwnerAndPermissions,
} from "template/shared/permissionsUtility";
import { updateWorldPermission } from "template/shared/worldSettingsReducer";

import config from "../config";

export type PermCommand = Command<{
	Player: NonOptionalArg<Player[]>;
	PermissionLevel: NonOptionalArg<PermissionTypes>;
}>;

const notificationManager = remotes.Server.Create("NotificationManager");

export const perm = identity<PermCommand>({
	name: "Perm",
	description: "Updates a 'Player'(s) to a specfic 'PermissionLevel'.",
	args: {
		Player: {
			name: "Player",
			id: 1,
			description: "The player or players you want update permission level of. [MULTIPLE]",
			type: t.array(t.instanceIsA("Player")),
			getValue(caller, command: PermCommand, input) {
				const players = getPlayerArg(caller, input);
				if (players.isEmpty()) {
					notificationManager.SendToPlayer(caller, {
						Type: "Add",
						Data: {
							Id: "CommandStatus",
							Title: "Invalid Player",
							Message: constructMessage(
								config.prefix,
								command,
								`Invalid value passed for Player`,
								this,
								input,
							),
							Icon: "rbxassetid://7148978151",
							Time: 5,
						},
					});
					return [false];
				}
				return [true, players];
			},
		},
		PermissionLevel: {
			name: "Permission Level",
			id: 2,
			description: "The new permission level for the player.",
			type: t.literal("TeamBlocko", "Builder", "Admin", "Visitor", "Owner"),
			getValue(caller, command: PermCommand, input) {
				const stateInfo = toOwnerAndPermissions(WorldManager.store.getState().Info);
				const callerRank = getUserRank(stateInfo, caller.UserId);

				const permissionLevel = PermissionRanks.find(
					(permission) => !!permission.lower().find(input.lower())[0],
				);
				if (!permissionLevel) {
					const validPermissionLevels = PermissionRanks.filter((_, index) => callerRank < index);
					const lastPermission = validPermissionLevels.pop();
					const permissions = `${validPermissionLevels.join(", ")}, and ${lastPermission}`;
					const message = constructMessage(
						config.prefix,
						command,
						`Invalid value passed for Permission Level${
							validPermissionLevels.size() !== 0 ? `, valid values include ${permissions}` : ""
						}`,
						this,
						input,
					);
					notificationManager.SendToPlayer(caller, {
						Type: "Add",
						Data: {
							Id: "CommandStatus",
							Title: "Invalid Permission Level",
							Message: message,
							Icon: "rbxassetid://7148978151",
							Time: 5,
						},
					});
					return [false];
				}
				return [true, permissionLevel];
			},
		},
	},
	execute(caller, args) {
		const stateInfo = toOwnerAndPermissions(WorldManager.store.getState().Info);
		const callerRank = getUserRank(stateInfo, caller.UserId);

		const message = args.Player.Value.map((player): string => {
			if (!calculatePermissionsOfUser(stateInfo, caller.UserId).ManagePermissions)
				return errorMsg(`You don't have permission to manage permissions`);

			if (callerRank >= getRank(args.PermissionLevel.Value))
				return errorMsg(`Your permission level is lower than the one you want to assign to ${player.Name}.`);

			if (callerRank >= getUserRank(stateInfo, player.UserId))
				return errorMsg(`${player.Name} has a higher permission level.`);
			print("SUCCESS UPDATED PERMISSION");
			WorldManager.store.dispatch(updateWorldPermission(player.UserId, args.PermissionLevel.Value));
			return `${successMsg("Successfully updated permission of")} ${player.Name} ${successMsg("to")} ${
				args.PermissionLevel
			}`;
		});
		notificationManager.SendToPlayer(
			caller,
			message.map((message) => {
				return {
					Type: "Add",
					Data: {
						Id: "CommandStatus",
						Title: "Command Status",
						Message: message,
						Icon: "rbxassetid://7148978151",
						Time: 5,
					},
				};
			}),
		);
	},
});
