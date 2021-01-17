import { ClientFunction } from "@rbxts/net";

const retriveWorldSettingsRemote = new ClientFunction<WorldSettings>("Replication"); 

export const retriveWorldSettings = () => retriveWorldSettingsRemote.CallServer()

