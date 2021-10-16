import { Server } from "@rbxts/net";
import type { Command, OptionalArg } from "../types";
import { constructMessage, errorMsg, getPlayerArg } from "../utility";
import { remotes } from "common/shared/remotes";
import { t } from "@rbxts/t";
import config from "../config";

export type TpCommand = Command<{
	Player1: OptionalArg<Player[]>;
	Player2: OptionalArg<Player>;
}>;

const notificationManager = remotes.Server.Create("NotificationManager");
const getMouseTarget = new Server.AsyncFunction<[Player], [], BasePart | undefined>("MouseTarget");

export const tp = identity<TpCommand>({
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
								config.prefix,
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
								config.prefix,
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
});
