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

export const PREFIX = "!";

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
		},
	}),
	tp: identity<Command>({
		name: "tp",
		args: [{ name: "Player", description: "The player you want to teleport to.", optional: true, default: "" }],
		execute(called, playerValue) {
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
				const player = Players.GetPlayers().find(
					(player) => !!player.Name.lower().match(`^${playerValue.lower()}`)[0],
				);
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
			return "Telported Successfully";
		},
	}),
};

export function isValidCommand(command: string): command is keyof typeof commands {
	return !!commands[command as keyof typeof commands];
}
