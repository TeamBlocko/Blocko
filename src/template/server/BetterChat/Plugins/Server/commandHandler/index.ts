import { ServerAPI, Message } from "./APITypes";
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

function registerProcessCommandsFunction(api: ServerAPI, messageObject: Message): [boolean, string] {
	const channel = api.channel.getChannel(messageObject.channel);
	const caller = api.speaker.getSpeaker(messageObject.fromSpeaker)?.getPlayer?.();

	if (channel && caller) {
		const parsed = parseMessage(messageObject.unfilteredMessage);

		const commandName = parsed.Ordered.shift()?.sub(PREFIX.size() + 1);

		if (!(commandName !== undefined && isValidCommand(commandName))) {
			return [false, ""];
		}

		const command = commands[commandName];

		for (const [index, arg] of ipairs(command.args)) {
			const passedValue = parsed.Ordered[index - 1];
			if (passedValue === undefined) {
				const finalMessage = constructMessage(PREFIX, command, `No value passed for ${arg.name}`, arg);
				return [true, finalMessage];
			}
		}

		return [true, command.execute(caller, ...parsed.Ordered)];
	}
	return [false, ""];
}

export = function (api: ServerAPI) {
	api.registerMessageProcessFunction((messageObject) => {
		if (!messageObject.isPlayer) return [false, ""];
		return registerProcessCommandsFunction(api, messageObject);
	});
};
