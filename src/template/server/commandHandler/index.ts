import { entries } from "@rbxts/object-utils";
import { remotes } from "common/shared/remotes";
import { isValidCommand, CommandsArgs, commands } from "./commandsBase";
import type { Arg, ArgsNames, ArgsResult } from "./types";
import { constructMessage } from "./utility";
import config from "./config";

const notificationManager = remotes.Server.Create("NotificationManager");

function parseMessage(message: string) {
	const messageIter = message.gmatch("%S+");
	const [command] = messageIter();

	const args: string[] = [];
	for (const [word] of messageIter) {
		args.push(tostring(word));
	}

	return {
		command: tostring(command)
			.sub(config.prefix.size() + 1)
			.lower(),
		args,
	};
}

export function handleCommand(caller: Player, message: string) {
	const parsed = parseMessage(message);

	const commandName = parsed.command;

	if (!(commandName !== undefined && isValidCommand(commandName))) {
		return [false, ""];
	}

	const command = commands[commandName];

	const commandArgs: ArgsResult = new Map();

	for (const [index, [key, arg]] of ipairs(
		(entries(command.args) as [ArgsNames, Arg][]).sort(([_a, aArg], [_b, bArg]) => aArg.id < bArg.id),
	)) {
		const passedValue = parsed.args[index - 1];

		if (passedValue === undefined && !arg.optional) {
			const message = constructMessage(config.prefix, command, `No value passed for Required arg ${arg.name}`, arg);
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
			return;
		}
		if (arg.optional === true) {
			const result = arg.getValue(
				caller,
				command,
				passedValue || arg.default,
				passedValue === undefined,
				commandArgs,
				{ registeredCommands: commands },
			);
			if (result[0] === false) return;
			commandArgs.set(key, {
				Value: result[1],
				IsDefault: passedValue === undefined,
			});
		} else {
			const result = arg.getValue(caller, command, passedValue, false, commandArgs, {
				registeredCommands: commands,
			});
			if (result[0] === false) return;
			commandArgs.set(key, {
				Value: result[1],
			});
		}
	}

	command.execute(caller, commandArgs as unknown as UnionToIntersection<CommandsArgs>, {
		registeredCommands: commands,
	});
}
