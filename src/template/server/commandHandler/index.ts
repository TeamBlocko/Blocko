import { isValidCommand, commands, PREFIX } from "./commands";
import { constructMessage } from "./messageUtility";

function parseMessage(message: string) {
	const messageIter = message.gmatch("%S+");
	const ordered: string[] = [];
	const nonOrdered = new Map<string, string>();
	for (const [word] of messageIter) {
		const [keyName] = tostring(word).match("^%-%-(%w+)");
		if (keyName !== undefined) {
			const [value] = messageIter();
			nonOrdered.set(tostring(keyName), tostring(value));
		} else {
			ordered.push(tostring(word));
		}
	}
	return {
		Ordered: ordered,
		NonOrdered: nonOrdered,
	};
}

export function handleCommand(caller: Player, message: string): [boolean, string] {
	const parsed = parseMessage(message);

	const commandName = parsed.Ordered.shift()?.sub(PREFIX.size() + 1);

	if (!(commandName !== undefined && isValidCommand(commandName))) {
		return [false, ""];
	}

	const command = commands[commandName];

	for (const [index, arg] of ipairs(command.args)) {
		const passedValue = parsed.Ordered[index - 1];
		if (arg.optional && passedValue === undefined) parsed.Ordered[index - 1] = arg.default;
		if (passedValue === undefined && !arg.optional) {
			const finalMessage = constructMessage(PREFIX, command, `No value passed for ${arg.name}`, arg);
			return [true, finalMessage];
		}
	}

	return [true, command.execute(caller, ...parsed.Ordered)];
}
