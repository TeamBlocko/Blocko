import { Arg, Command, OptionalArg } from "./commands";

export function errorMsg(str: string) {
	return `<font color="rgb(255, 80, 80)">${str}</font>`;
}

export function successMsg(str: string) {
	return `<font color="rgb(80, 200, 120)">${str}</font>`;
}

export function constructMessage(
	prefix: string,
	command: Command,
	err: string,
	arg: Arg | OptionalArg,
	value?: string,
): string {
	const message = `${prefix}${command.name} ${command.args.map((arg) => arg.name).join(" ")}`;

	const [modifiedMessage] =
		value !== undefined
			? message.gsub(arg.name, errorMsg(`<i>${arg.name}: ${value}</i>`))
			: message.gsub(arg.name, errorMsg(`<i>${arg.name}</i>`));

	return `${errorMsg(err)}: ${modifiedMessage}`;
}
