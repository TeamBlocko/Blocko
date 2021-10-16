import { remotes as templateRemotes } from "template/shared/remotes";
import type { ArgsConstructor, Command, CommandsType } from "./types";
import { HelpCommand, help } from "./commands/help";
import { PermCommand, perm } from "./commands/perm";
import { TpCommand, tp } from "./commands/tp";

export const PREFIX = "!";

const toggleDebug = templateRemotes.Server.Create("ToggleDebug");

export type DebugCommand = Command<Record<string, never>>;

export type Commands = PermCommand | TpCommand | HelpCommand | DebugCommand;
export type CommandsArgs = Commands extends Command<infer U> ? ArgsConstructor<U> : never;

export const commands: CommandsType = {
	perm,
	tp,
	help,
	debug: identity<DebugCommand>({
		name: "Debug",
		description: "Toggles Console Debugs.",
		args: {},
		execute(caller: Player) {
			toggleDebug.SendToPlayer(caller);
		},
	}),
};

export function isValidCommand(command: string): command is keyof typeof commands {
	return !!commands[command as keyof typeof commands];
}
