import { Arg, Command } from "./commands"

export function errorMsg(str: string) {
	return `(255, 0, 0 / ${str} )`
}

export function constructMessage(prefix: string, command: Command, err: string, arg: Arg, value?: string): string {
	const message = `${prefix}${command.name} ${command.args.map(arg => arg.name).join(" ")}`

	const [modifiedMessage] = value !== undefined ?
		message.gsub(arg.name, errorMsg(`__${arg.name}: ${value}__`))
		: message.gsub(arg.name, errorMsg(`__${arg.name}__`))

	return `${errorMsg(err)}: ${modifiedMessage}`
}