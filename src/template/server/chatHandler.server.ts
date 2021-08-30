import { Players } from "@rbxts/services";
import { handleCommand } from "./commandHandler";
import { remotes } from "template/shared/remotes";

const notificationHandler = remotes.Server.Create("NotificationManager");

function setupChat(player: Player) {
	player.Chatted.Connect((message) => {
		const result = handleCommand(player, message);
		if (result[0] === true) {
			notificationHandler.SendToPlayer(player, [
				{
					Type: "Add",
					Data: {
						Id: "CommandStatus",
						Title: "Command Status",
						Message: result[1],
						Icon: "rbxassetid://7148978151",
						Time: 5,
					},
				},
			]);
		}
	});
}

Players.PlayerAdded.Connect(setupChat);
for (const player of Players.GetPlayers()) setupChat(player);
