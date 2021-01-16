import { ClientFunction, ClientEvent } from "@rbxts/net";
import { AnyAction } from "@rbxts/rodux";
import { $terrify } from "rbxts-transformer-t"
import store from "./store";

const retriveWorldSettingsRemote = new ClientFunction<WorldSettings>("Replication"); 
const updateWorldSettingsRemote = new ClientEvent("UpdateWorldSettings");

export const retriveWorldSettings = () => retriveWorldSettingsRemote.CallServer()

export const updateWorldSettings = (action: ActionRecievedUpdateWorldSettings) => updateWorldSettingsRemote.SendToServer(action) 

updateWorldSettingsRemote.Connect((action: ActionRecievedUpdateWorldSettings & AnyAction) => store.dispatch(action))