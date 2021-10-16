import { keys, values } from "@rbxts/object-utils";
import { remotes } from "common/shared/remotes";
import { langList } from "common/shared/utility";
import type { Commands } from "../commands";
import type { Arg, Command, OptionalArg } from "../types";

export type HelpCommand = Command<{
	CommandName: OptionalArg<Commands>;
	ArgName: OptionalArg<Arg>;
}>;

const notificationManager = remotes.Server.Create("NotificationManager");

export const help = identity<HelpCommand>({
	name: "Help",
	description: "Shows full list of Blocko chat commands.",
	args: {
		CommandName: {
			name: "Command Name",
			id: 1,
			description: "The name of the 'Command' you want info of.",
			optional: true,
			default: "",
			type: (_value): _value is Commands => {
				return true;
			},
			getValue(caller, _command: HelpCommand, input, isDefault, _, env) {
				const commands = values(env.registeredCommands);
				const commandRequested = commands.find((command) => command.name.lower() === input.lower());
				if (!commandRequested && !isDefault) {
					notificationManager.SendToPlayer(caller, {
						Type: "Add",
						Data: {
							Id: "CommandStatus",
							Title: "Invalid Command Name",
							Message: `Invalid value passed for Command Name, valid values include: ${langList(
								commands.map((value) => value.name),
							)}`,
							Icon: "rbxassetid://7148978151",
							Time: 5,
						},
					});
					return [false];
				}
				return [true, commandRequested];
			},
		},
		ArgName: {
			name: "Arg Name",
			id: 2,
			description: "The name of the 'Arg' you want info of",
			optional: true,
			default: "",
			type: (_value): _value is Arg => {
				return true;
			},
			getValue(caller, _command: HelpCommand, input, isDefault, previousArgs) {
				const commandRequested = previousArgs.get("CommandName")?.Value as Commands | undefined;
				if (commandRequested) {
					const arg = (keys(commandRequested.args) as string[]).find((key) => key.lower() === input.lower());
					if (!arg === true && !isDefault) {
						notificationManager.SendToPlayer(caller, {
							Type: "Add",
							Data: {
								Id: "CommandStatus",
								Title: "Invalid Arg",
								Message: `Invalid value passed for Arg Name`,
								Icon: "rbxassetid://7148978151",
								Time: 5,
							},
						});
						return [false];
					}
					if (arg !== undefined) {
						return [true, commandRequested.args[arg as keyof typeof commandRequested.args]];
					} else {
						return [true, undefined];
					}
				}
				return [true, undefined];
			},
		},
	},
	execute(caller, args, env) {
		if (!args.CommandName.Value) {
			const commandsList = values(env.registeredCommands)
				.map((command) => {
					return `${command.name}: ${command.description}`;
				})
				.join("\n");
			notificationManager.SendToPlayer(caller, {
				Type: "Add",
				Data: {
					Id: "CommandStatus",
					Title: "Commands List",
					Message: commandsList,
					Icon: "rbxassetid://7148978151",
					Time: 10,
				},
			});
			return;
		}
		if (!args.ArgName.Value) {
			const command = args.CommandName.Value;
			const message = `${command.name}: ${command.description}\n${(values(command.args) as Arg[])
				.map((arg) => `${arg.name}: ${arg.description}`)
				.join("\n")}`;
			notificationManager.SendToPlayer(caller, {
				Type: "Add",
				Data: {
					Id: "CommandStatus",
					Title: `${command.name}'s Info`,
					Message: message,
					Icon: "rbxassetid://7148978151",
					Time: 10,
				},
			});
			return;
		}
	},
});
