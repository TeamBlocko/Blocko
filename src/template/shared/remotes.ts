import { Definitions } from "@rbxts/net";
import { AnyAction } from "@rbxts/rodux";
import { PlacementSettings } from "./Types";
import { ActionRecievedUpdateWorldSettings, WorldSettingsActionTypes } from "./worldSettingsReducer";

export const remotes = Definitions.Create({
	UpdateWorldSettings: Definitions.Function<[ActionRecievedUpdateWorldSettings], void>(),
	Replication: Definitions.Function<[], World>(),
	UpdateClientSettings: Definitions.ServerToClientEvent<[action: WorldSettingsActionTypes & AnyAction]>(),
	PlaceBlock: Definitions.Function<[Vector3, Vector3, PlacementSettings], BasePart | undefined>(),
	DeleteBlock: Definitions.Function<[BasePart], void>(),
	NotificationManager: Definitions.ServerToClientEvent<[RemoteNotification | RemoteNotification[]]>(),
});
