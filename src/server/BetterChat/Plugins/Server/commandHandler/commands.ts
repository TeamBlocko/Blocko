import { Players } from "@rbxts/services";
import { PermissionRanks } from "shared/permissionsUtility";
import WorldManager from "server/WorldManager";
import { updateWorldInfo } from "shared/worldSettingsReducer";

export interface Arg<T = defined> {
	name: string,
	description: string,
	validate: (value: string) => T | undefined;
}

export interface Command {
	name: string,
	args: Arg[],
	execute: (...args: unknown[]) => void
}

export const commands = {
	perm: identity<Command>({
		name: "Perm",
		args: [
			{ name: "Player", description: "The player you want to change the permission of.", validate: (value) => {
				return Players.GetPlayers().find(player => !!player.Name.lower().match(`^${value.lower()}`)[0])
			}},
			{ name: "Permission Level", description: "The new permission level for the player.", validate: (value) => {
				return PermissionRanks.find(permission => !!permission.lower().match(`^${value.lower()}`)[0])
			}}
		],
		execute: (player, permissionLevel) => {
			print(player, permissionLevel)
		}
	})
}

export function isValidCommand(command: string): command is keyof typeof commands  {
	return !!commands[command as keyof typeof commands]
}