import { Players } from "@rbxts/services";
import { Server } from "@rbxts/net";
import {
	PermissionRanks,
	getUserRank,
	getRank,
	calculatePermissionsOfUser,
	toOwnerAndPermissions,
} from "template/shared/permissionsUtility";
import WorldManager from "template/server/WorldManager";
import { updateWorldPermission } from "template/shared/worldSettingsReducer";
import { constructMessage, errorMsg } from "./messageUtility";
import { remotes } from "common/shared/remotes";

export const PREFIX = "!";

const INVALID_PLAYER_ERROR = `Invalid value passed for Player. valid values include player display/names, "all" and "other"`;

const notificationHandler = remotes.Server.Create("NotificationManager");
const getMouseTarget = new Server.AsyncFunction<[Player], [], BasePart | undefined>("MouseTarget");

export interface Arg {
	name: string;
	description: string;
	optional?: false;
}

export interface OptionalArg {
	name: string;
	description: string;
	optional: true;
	default: string;
}

export interface Command {
	name: string;
	args: (Arg | OptionalArg)[];
	execute(caller: Player, ...args: string[]): string;
}

function getPlayerArg(caller: Player, inputValue: string, singular: boolean = false): Player[] {
	const input = inputValue.lower();
	if (!singular) {
		if (input === "all") return Players.GetPlayers();
		if (input === "other") return Players.GetPlayers().filter(player => player.UserId === caller.UserId);
	}
	const inputPlayer = Players.GetPlayers().find(player => !player.Name.lower().find(input)[0] || !player.DisplayName.lower().find(input)[0])
	if (inputPlayer) return [inputPlayer];
	return []
}

export const commands = {
	perm: identity<Command>({
		name: "Perm",
		args: [
			{ name: "Player", description: "The player you want to change the permission of." },
			{ name: "Permission Level", description: "The new permission level for the player." },
		],
		execute(caller, playerValue, permissionLevelValue) {
			const players = getPlayerArg(caller, playerValue);
			if (players.isEmpty()) return constructMessage(PREFIX, this, `Invalid value passed for Player. valid values include player display/names, "all" and "other"`, this.args[0], playerValue);
			const finalMessage = players.map((player): string => {
				const stateInfo = toOwnerAndPermissions(WorldManager.store.getState().Info);
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
				return `Successfully updated permission of ${player.Name} to ${permissionLevel}`;
			});
			notificationHandler.SendToPlayer(caller, finalMessage.map(message => {
				return {
					Type: "Add",
					Data: {
						Id: "CommandStatus",
						Title: "Command Status",
						Message: message,
						Icon: "rbxassetid://7148978151",
						Time: 5,
					},
				}
			}));
			return ""
		},
	}),
	tp: identity<Command>({
		name: "tp",
		args: [
			{ name: "Player1", description: "Target Player or Player the caller wants to teleport to.", optional: true, default: "" },
			{ name: "Player2", description: "Player the caller wants to teleport to.", optional: true, default: "" },
		],
		execute(called, playerValue, player2Value) {
			if (playerValue === (this.args[0] as OptionalArg).default) {
				const result = getMouseTarget.CallPlayerAsync(called).await();
				if (result[0]) {
					const target = result[1];
					if (!target)
						return errorMsg(
							"Hover on a Part you want to teleport to or pass a Player you want to teleport to.",
						);
					const callerHumanoid = (called.Character || called.CharacterAdded.Wait()[0]).WaitForChild(
						"HumanoidRootPart",
					) as Part;
					callerHumanoid.Position = target.Position.add(new Vector3(0, target.Size.Y, 0));
				}
			} else {
				if (player2Value === (this.args[1] as OptionalArg).default) {
					
					const players = getPlayerArg(called, playerValue);
					if (players.size() === 0)
						return constructMessage(PREFIX, this, INVALID_PLAYER_ERROR, this.args[0], playerValue);

					const player2 = getPlayerArg(called, player2Value, true)[0];
					if (!player2)
						return constructMessage(PREFIX, this, `Invalid value passed for Player`, this.args[1], player2Value);
					for (const player of players) {

						const player1Humanoid = (player.Character || player.CharacterAdded.Wait()[0]).WaitForChild(
							"HumanoidRootPart",
						) as Part;
						const player2Humanoid = (player2.Character || player2.CharacterAdded.Wait()[0]).WaitForChild(
							"HumanoidRootPart",
						) as Part;
						player1Humanoid.Position = player2Humanoid.Position;
					
					}
				} else {
					const player = getPlayerArg(called, playerValue, true)[0];
					if (!player)
						return constructMessage(PREFIX, this, `Invalid value passed for Player`, this.args[0], playerValue);
					
					const callerHumanoid = (called.Character || called.CharacterAdded.Wait()[0]).WaitForChild(
						"HumanoidRootPart",
					) as Part;
					const playerHumanoid = (player.Character || player.CharacterAdded.Wait()[0]).WaitForChild(
						"HumanoidRootPart",
					) as Part;
					callerHumanoid.Position = playerHumanoid.Position;
			
				}
			}
			return "Telported Successfully";
		},
	}),
};

export function isValidCommand(command: string): command is keyof typeof commands {
	return !!commands[command as keyof typeof commands];
}
