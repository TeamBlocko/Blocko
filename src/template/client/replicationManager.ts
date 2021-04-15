import { Client } from "@rbxts/net";
import { Players } from "@rbxts/services";

const result = Client.GetFunctionAsync<[], World>("Replication").await();

if (result[0] === false) {
	Players.LocalPlayer.Kick("Failed to setup Replication events")
	throw "Failed to setup Replication events";
}

export const retriveWorldSettings = () => result[1].CallServer();
