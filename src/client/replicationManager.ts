import { ClientFunction } from "@rbxts/net";

const retriveWorldSettingsRemote = new ClientFunction<WorldInfo>("Replication");

export const retriveWorldSettings = () => retriveWorldSettingsRemote.CallServer();
