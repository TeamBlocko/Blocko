import { Client } from "@rbxts/net";

const retriveWorldSettingsRemote = new Client.Function<[], World>("Replication");

export const retriveWorldSettings = () => retriveWorldSettingsRemote.CallServer();
