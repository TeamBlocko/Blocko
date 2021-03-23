import { ClientFunction } from "@rbxts/net";

const retriveWorldSettingsRemote = new ClientFunction<World>("Replication");

export const retriveWorldSettings = () => retriveWorldSettingsRemote.CallServer();
