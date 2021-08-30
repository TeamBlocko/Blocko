import { Players } from "@rbxts/services";
import { remotes } from "template/shared/remotes";

const result = remotes.Client.WaitFor("Replication").await();

if (result[0] === false) {
	Players.LocalPlayer.Kick("Failed to setup Replication events");
	throw "Failed to setup Replication events";
}

export const retriveWorldSettings = () => result[1].CallServer();
