import { Players } from "@rbxts/services";
import { values } from "@rbxts/object-utils";
import type { Commands } from "./commands";
import type { Arg } from "./types";

export function errorMsg(str: string) {
	return `<font color="rgb(255, 80, 80)">${str}</font>`;
}

export function successMsg(str: string) {
	return `<font color="rgb(80, 200, 120)">${str}</font>`;
}

export function constructMessage(prefix: string, command: Commands, err: string, arg: Arg, value?: string): string {
	const message = `${prefix}${command.name} ${(values(command.args) as Arg[]).map((arg) => arg.name).join(" ")}`;

	const [modifiedMessage] =
		value !== undefined
			? message.gsub(arg.name, errorMsg(`<i>${arg.name}: ${value}</i>`))
			: message.gsub(arg.name, errorMsg(`<i>${arg.name}</i>`));

	return `${errorMsg(err)}: ${modifiedMessage}`;
}

export function PRINT<T>(value: T): T {
	print(value);
	return value;
}

export function getPlayerArg(caller: Player, inputValue: string, singular = false): Player[] {
	if (inputValue === "") return [];
	const input = inputValue.lower();
	if (!singular) {
		if (input.find(",")[0])
			return input.split(",").mapFiltered((playerInput) => {
				if (inputValue === "") return;
				return Players.GetPlayers().find(
					(player) =>
						!!player.Name.lower().find(playerInput.lower())[0] ||
						!!player.DisplayName.lower().find(playerInput.lower())[0],
				);
			});
		if (input === "all") return Players.GetPlayers();
		if (input === "other") return Players.GetPlayers().filter((player) => player.UserId === caller.UserId);
	}
	const inputPlayer = Players.GetPlayers().find(
		(player) => !!player.Name.lower().find(input)[0] || !!player.DisplayName.lower().find(input)[0],
	);
	if (inputPlayer) return PRINT([inputPlayer]);
	return [];
}
