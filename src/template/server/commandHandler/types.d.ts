import { t } from "@rbxts/t";
import { Commands, DebugCommand } from "./commandsBase";
import { HelpCommand } from "./commands/help";
import { PermCommand } from "./commands/perm";
import { TpCommand } from "./commands/tp";

export interface NonOptionalArg<T> {
	name: string;
	id: number;
	description: string;
	getValue(
		caller: Player,
		command: Commands,
		input: string,
		isDefault: boolean,
		previousArgs: ArgsResult,
		env: Env,
	): [true, T | undefined] | [false];
	optional?: false | undefined;
	type: t.check<T>;
}

export interface Env {
	registeredCommands: CommandsType;
}

export interface OptionalArg<T> {
	name: string;
	id: number;
	description: string;
	getValue(
		caller: Player,
		command: Commands,
		input: string,
		isDefault: boolean,
		previousArgs: Map<string, { Value: unknown }>,
		env: Env,
	): [true, T | undefined] | [false];
	optional: true;
	default: string;
	type: t.check<T>;
}

export type Arg<T = unknown> = NonOptionalArg<T> | OptionalArg<T>;

export type ArgsConstructor<T extends Record<string, Arg>> = {
	[P in keyof T]: {
		Value: T[P] extends OptionalArg<unknown>
			? T[P] extends Arg<infer U>
				? U | undefined
				: never
			: T[P] extends Arg<infer U>
			? U
			: never;
		IsDefault: boolean;
	};
};

export interface Command<T extends Record<string, Arg>> {
	name: string;
	description: string;
	args: T;
	execute(caller: Player, args: ArgsConstructor<T>, env: Env): void;
}

export type CommandsType = {
	perm: PermCommand;
	tp: TpCommand;
	help: HelpCommand;
	debug: DebugCommand;
};

// type Args = { [K in keyof CommandsType]: { [P in keyof CommandsType[K]["args"]]: CommandsType[K]["args"][P] }[keyof CommandsType[K]["args"]] }[keyof CommandsType]
// type Values = Args extends Arg<infer U> ? U : never;
type ArgsValues = { Value: unknown; IsDefault?: boolean };
export type ArgsNames = {
	[K in keyof CommandsType]: { [P in keyof CommandsType[K]["args"]]: P }[keyof CommandsType[K]["args"]];
}[keyof CommandsType];
export type ArgsResult = Map<ArgsNames, ArgsValues>;
