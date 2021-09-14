import { Players } from "@rbxts/services";
import { Server } from "@rbxts/net";
import { t } from "@rbxts/t";
import {
	calculatePermissionsOfUser,
	getRank,
	getUserRank,
	PermissionRanks,
	toOwnerAndPermissions,
} from "template/shared/permissionsUtility";
import { constructMessage, errorMsg, successMsg } from "./messageUtility";
import { remotes } from "common/shared/remotes";
import { remotes as templateRemotes } from "template/shared/remotes";
import WorldManager from "../WorldManager";
import { updateWorldPermission } from "template/shared/worldSettingsReducer";
import { keys, values } from "@rbxts/object-utils";
import { langList } from "common/shared/utility";

interface NonOptionalArg<T> {
	name: string;
	id: number;
	description: string;
	getValue(
		caller: Player,
		command: Commands,
		input: string,
		isDefault: boolean,
		previousArgs: ArgsResult,
	): [true, T | undefined] | [false];
	optional?: false | undefined;
	type: t.check<T>;
}

interface OptionalArg<T> {
	name: string;
	id: number;
	description: string;
	getValue(
		caller: Player,
		command: Commands,
		input: string,
		isDefault: boolean,
		previousArgs: Map<string, { Value: unknown }>,
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
		}

export interface Command<T extends Record<string, Arg>> {
	name: string;
	description: string;
	args: T;
	execute(
		caller: Player,
		args: ArgsConstructor<T>,
	): void;
}

export const PREFIX = "!";

const notificationManager = remotes.Server.Create("NotificationManager");
const toggleDebug = templateRemotes.Server.Create("ToggleDebug");
const getMouseTarget = new Server.AsyncFunction<[Player], [], BasePart | undefined>("MouseTarget");

function PRINT<T>(value: T): T { print(value); return value};

function getPlayerArg(caller: Player, inputValue: string, singular = false): Player[] {
	if (inputValue === "") return [];
	const input = inputValue.lower();
	if (!singular) {
		if (input.find(",")[0])
			return input
				.split(",")
				.mapFiltered((playerInput) => {
					if (inputValue === "") return;
					return Players.GetPlayers().find(
						(player) =>
							!!player.Name.lower().find(playerInput.lower())[0] ||
							!!player.DisplayName.lower().find(playerInput.lower())[0],
					)
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

type PermCommand = Command<{
	Player: NonOptionalArg<Player[]>;
	PermissionLevel: NonOptionalArg<PermissionTypes>;
}>;

type TpCommand = Command<{
	Player1: OptionalArg<Player[]>;
	Player2: OptionalArg<Player>;
}>;

type HelpCommand = Command<{
	CommandName: OptionalArg<Commands>;
	ArgName: OptionalArg<Arg>;
}>;

type DebugCommand = Command<Record<string, never>>;

export type Commands = PermCommand | TpCommand | HelpCommand | DebugCommand;
export type CommandsArgs = Commands extends Command<infer U> ? ArgsConstructor<U> : never;

let commands: {
	perm: PermCommand;
	tp: TpCommand;
	help: HelpCommand;
	debug: DebugCommand;
};

commands = {
	perm: identity<PermCommand>({
		name: "Perm",
		description: "Updates a 'Player'(s) to a specfic 'PermissionLevel'.",
		args: {
			Player: {
				name: "Player",
				id: 1,
				description: "The player or players you want update permission level of. [MULTIPLE]",
				type: t.array(t.instanceIsA("Player")),
				getValue(caller, command: PermCommand, input) {
					const players = getPlayerArg(caller, input);
					if (players.isEmpty()) {
						notificationManager.SendToPlayer(caller, {
							Type: "Add",
							Data: {
								Id: "CommandStatus",
								Title: "Invalid Player",
								Message: constructMessage(
									PREFIX,
									command,
									`Invalid value passed for Player`,
									this,
									input,
								),
								Icon: "rbxassetid://7148978151",
								Time: 5,
							},
						});
						return [false];
					}
					return [true, players];
				},
			},
			PermissionLevel: {
				name: "Permission Level",
				id: 2,
				description: "The new permission level for the player.",
				type: t.literal("TeamBlocko", "Builder", "Admin", "Visitor", "Owner"),
				getValue(caller, command: PermCommand, input) {
					const stateInfo = toOwnerAndPermissions(WorldManager.store.getState().Info);
					const callerRank = getUserRank(stateInfo, caller.UserId);

					const permissionLevel = PermissionRanks.find(
						(permission) => !!permission.lower().find(input.lower())[0],
					);
					if (!permissionLevel) {
						const validPermissionLevels = PermissionRanks.filter((_, index) => callerRank < index);
						const lastPermission = validPermissionLevels.pop();
						const permissions = `${validPermissionLevels.join(", ")}, and ${lastPermission}`;
						const message = constructMessage(
							PREFIX,
							command,
							`Invalid value passed for Permission Level${
								validPermissionLevels.size() !== 0 ? `, valid values include ${permissions}` : ""
							}`,
							this,
							input,
						);
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
						return [false];
					}
					return [true, permissionLevel];
				},
			},
		},
		execute(caller, args) {
			const stateInfo = toOwnerAndPermissions(WorldManager.store.getState().Info);
			const callerRank = getUserRank(stateInfo, caller.UserId);

			const message = args.Player.Value.map((player): string => {
				if (!calculatePermissionsOfUser(stateInfo, caller.UserId).ManagePermissions)
					return errorMsg(`You don't have permission to manage permissions`);

				if (callerRank >= getRank(args.PermissionLevel.Value))
					return errorMsg(
						`Your permission level is lower than the one you want to assign to ${player.Name}.`,
					);

				if (callerRank >= getUserRank(stateInfo, player.UserId))
					return errorMsg(`${player.Name} has a higher permission level.`);
				print("SUCCESS UPDATED PERMISSION");
				WorldManager.store.dispatch(updateWorldPermission(player.UserId, args.PermissionLevel.Value));
				return `${successMsg("Successfully updated permission of")} ${player.Name} ${successMsg("to")} ${
					args.PermissionLevel
				}`;
			});
			notificationManager.SendToPlayer(
				caller,
				message.map((message) => {
					return {
						Type: "Add",
						Data: {
							Id: "CommandStatus",
							Title: "Command Status",
							Message: message,
							Icon: "rbxassetid://7148978151",
							Time: 5,
						},
					};
				}),
			);
		},
	}),
	tp: identity<TpCommand>({
		name: "Tp",
		description: "Teleports a `Player1`(s) to a specfic `Player2`",
		args: {
			Player1: {
				name: "Player1",
				id: 1,
				description: "Player(s) to teleport",
				optional: true,
				default: "",
				type: t.array(t.instanceIsA("Player")),
				getValue(caller, command: TpCommand, input, isDefault) {
					const players = getPlayerArg(caller, input);
					print("PLAYER1", players);
					if (players.isEmpty() && !isDefault) {
						notificationManager.SendToPlayer(caller, {
							Type: "Add",
							Data: {
								Id: "CommandStatus",
								Title: "Invalid Player",
								Message: constructMessage(
									PREFIX,
									command,
									`Invalid value passed for Player1`,
									this,
									input,
								),
								Icon: "rbxassetid://7148978151",
								Time: 5,
							},
						});
						return [false];
					}
					return [true, players];
				},
			},
			Player2: {
				name: "Player2",
				id: 2,
				description: "Player to teleport to",
				optional: true,
				default: "",
				type: t.instanceIsA("Player"),
				getValue(caller, command: TpCommand, input, isDefault) {
					const players = getPlayerArg(caller, input, true);
					if (players.isEmpty() && !isDefault) {
						notificationManager.SendToPlayer(caller, {
							Type: "Add",
							Data: {
								Id: "CommandStatus",
								Title: "Invalid Player",
								Message: constructMessage(
									PREFIX,
									command,
									`Invalid value passed for Player`,
									this,
									input,
								),
								Icon: "rbxassetid://7148978151",
								Time: 5,
							},
						});
						return [false];
					}
					return [true, players[0]];
				},
			},
		},
		execute(caller, args) {
			if (!args.Player1.Value || args.Player1.Value.isEmpty()) {
				const result = getMouseTarget.CallPlayerAsync(caller).await();
				if (result[0]) {
					const target = result[1];
					if (!target)
						return errorMsg(
							"Hover on a Part you want to teleport to or pass a Player you want to teleport to.",
						);
					const callerHumanoid = (caller.Character || caller.CharacterAdded.Wait()[0]).WaitForChild(
						"HumanoidRootPart",
					) as Part;
					callerHumanoid.CFrame = target.CFrame.add(new Vector3(0, target.Size.Y, 0));
				}
				return;
			}
			if (!args.Player2.Value) {
				const callerHumanoid = (caller.Character || caller.CharacterAdded.Wait()[0]).WaitForChild(
					"HumanoidRootPart",
				) as Part;
				const playerHumanoid = (
					args.Player1.Value[0].Character || args.Player1.Value[0].CharacterAdded.Wait()[0]
				).WaitForChild("HumanoidRootPart") as Part;
				callerHumanoid.CFrame = playerHumanoid.CFrame;
				return;
			}
			for (const player of args.Player1.Value) {
				const player1Humanoid = (player.Character || player.CharacterAdded.Wait()[0]).WaitForChild(
					"HumanoidRootPart",
				) as Part;
				const player2Humanoid = (
					args.Player2.Value.Character || args.Player2.Value.CharacterAdded.Wait()[0]
				).WaitForChild("HumanoidRootPart") as Part;
				player1Humanoid.CFrame = player2Humanoid.CFrame;
			}
		},
	}),
	help: identity<HelpCommand>({
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
				getValue(caller, _command: HelpCommand, input, isDefault) {
					const commandRequested = values(commands).find((command) => command.name.lower() === input.lower());
					if (!commandRequested && !isDefault) {
						notificationManager.SendToPlayer(caller, {
							Type: "Add",
							Data: {
								Id: "CommandStatus",
								Title: "Invalid Command Name",
								Message: `Invalid value passed for Command Name, valid values include: ${langList([
									"perm",
									"tp",
									"help",
								])}`,
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
						const arg = (keys(commandRequested.args) as string[]).find(
							(key) => key.lower() === input.lower(),
						);
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
						};
					}
					return [true, undefined];
				},
			},
		},
		execute(caller, args) {
			if (!args.CommandName.Value) {
				const commandsList = values(commands).map(command => {
					return `${command.name}: ${command.description}`
				}).join("\n");
				notificationManager.SendToPlayer(caller, {
					Type: "Add",
					Data: {
						Id: "CommandStatus",
						Title: "Commands List",
						Message: commandsList,
						Icon: "rbxassetid://7148978151",
						Time: 10,
					},
				})
				return;
			}
			if (!args.ArgName.Value) {
				const command = args.CommandName.Value;
				const message = `${command.name}: ${command.description}\n${(values(command.args) as Arg[]).map((arg => `${arg.name}: ${arg.description}`)).join("\n")}`
				notificationManager.SendToPlayer(caller, {
					Type: "Add",
					Data: {
						Id: "CommandStatus",
						Title: `${command.name}'s Info`,
						Message: message,
						Icon: "rbxassetid://7148978151",
						Time: 10,
					},
				})
				return;	
			}
		},
	}),
	debug: identity<DebugCommand>({
		name: "Debug",
		description: "Toggles Console Debugs.",
		args: {},
		execute(caller: Player) {
			toggleDebug.SendToPlayer(caller);
		}
	}),
};

type CommandsType = typeof commands;
// type Args = { [K in keyof CommandsType]: { [P in keyof CommandsType[K]["args"]]: CommandsType[K]["args"][P] }[keyof CommandsType[K]["args"]] }[keyof CommandsType]
// type Values = Args extends Arg<infer U> ? U : never;
type ArgsValues = { Value: unknown, IsDefault?: boolean };
export type ArgsNames = { [K in keyof CommandsType]: { [P in keyof CommandsType[K]["args"]]: P }[keyof CommandsType[K]["args"]] }[keyof CommandsType]
export type ArgsResult = Map<ArgsNames, ArgsValues>

export const Commands = commands;

export function isValidCommand(command: string): command is keyof typeof commands {
	return !!commands[command as keyof typeof commands];
}
