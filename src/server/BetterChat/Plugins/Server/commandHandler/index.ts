import { Players } from "@rbxts/services";

import { ServerAPI, Message } from "./APITypes"

import WorldManager from "server/WorldManager";
import { isPermed } from "shared/permissionsUtility";
import { isValidCommand, commands, Arg, Command } from "./commands";

const PREFIX = "!"

function parseMessage(message: string) {
	const messageIter = message.gmatch("[%b''%S]+")
	const ordered = []
	const nonOrdered = new Map<string, string>()
	for (const [word] of messageIter) {
		const [keyName] = tostring(word).match("^%-%-(%w+)")
		if (keyName !== undefined) {
			const [value] = messageIter()
			nonOrdered.set(tostring(keyName), tostring(value))
		} else {
			ordered.push(tostring(word))
		}
	}
	return {
		Ordered: ordered,
		NonOrdered: nonOrdered,
	}
}

function constructMessage(command: Command, err: string, arg: Arg, value?: string): string {
	const message = `${PREFIX}${command.name} ${command.args.map(arg => arg.name).join(" ")}`

	const [modifiedMessage] = value !== undefined ?
		message.gsub(arg.name, `(255, 0, 0 / __${arg.name}: ${value}__)`)
		: message.gsub(arg.name, `(255, 0, 0 / __${arg.name}__)`)

	return `(255, 0, 0 / ${err}): ${modifiedMessage}`
}

function registerProcessCommandsFunction(api: ServerAPI, messageObject: Message): [boolean, string] {
	const channel = api.channel.getChannel(messageObject.channel)

	if (channel) {
		const parsed = parseMessage(messageObject.unfilteredMessage)

		const commandName = parsed.Ordered.shift()?.sub(PREFIX.size() + 1)

		if (!(commandName && isValidCommand(commandName))) {
			return [false, ""]
		}

		const command = commands[commandName]
		const valided: defined[] = []
		for (const arg of command.args) {
			const passedValue = parsed.Ordered.shift()
			if (passedValue !== undefined) {
				const validated = arg.validate(passedValue)
				if (validated) {
					valided.push(validated)
				} else {
					const finalMessage = constructMessage(command, `Invalid value passed at ${arg.name}`, arg, passedValue)
					return [true, finalMessage]
				}
			} else {
				const finalMessage = constructMessage(command, `No value passed for ${arg.name}`, arg)
				return [true, finalMessage]
			}
		}
		command.execute(...valided)
		return [true, "Ran successfully!"]
	}
	return [false, ""]
}

export = function(api: ServerAPI) {
	api.registerMessageProcessFunction(messageObject => {
		if (!messageObject.isPlayer) return [false, ""]
		return registerProcessCommandsFunction(api, messageObject)
	})
}
