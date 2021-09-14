import { Players } from "@rbxts/services";
import { handleCommand } from "./commandHandler";

function setupChat(player: Player) {
	player.Chatted.Connect((message) => {
		handleCommand(player, message);
	});
}

Players.PlayerAdded.Connect(setupChat);
for (const player of Players.GetPlayers()) setupChat(player);
