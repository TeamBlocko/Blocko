import { remotes } from "template/shared/remotes";

const result = remotes.Client.Get("Replication");
/*
if (result[0] === false) {
	Players.LocalPlayer.Kick("Failed to setup Replication events");
	throw "Failed to setup Replication events";
}
*/
export const retriveWorldSettings = () => result.CallServer();
