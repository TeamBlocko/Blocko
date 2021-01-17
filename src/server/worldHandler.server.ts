import { ServerFunction, ServerEvent } from "@rbxts/net";
import { $terrify } from "rbxts-transformer-t";

const retriveWorldSettingsRemote = new ServerFunction("Replication");
const updateWorldSettingsRemote = new ServerEvent("UpdateWorldSettings", $terrify<UpdateWorldSettings>());

import WorldManager from "./WorldManager";

game.BindToClose(() => {
	WorldManager.Save();
});

retriveWorldSettingsRemote.SetCallback(() => WorldManager.store.getState());

updateWorldSettingsRemote.Connect((player, action) => WorldManager.store.dispatch(action as any));

while (true) {
	wait(10);
	WorldManager.Save();
}
