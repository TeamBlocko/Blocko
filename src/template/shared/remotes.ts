import { Definitions } from "@rbxts/net";
import { AnyAction } from "@rbxts/rodux";
import { PlacementSettings } from "./Types";
import { ActionRecievedUpdateWorldSettings, WorldSettingsActionTypes } from "./worldSettingsReducer";

export const remotes = Definitions.Create({
	UpdateWorldSettings: Definitions.ServerFunction<(action: ActionRecievedUpdateWorldSettings) => void>(),
	Replication: Definitions.ServerFunction<() => World>(),
	UpdateClientSettings: Definitions.ServerToClientEvent<[action: WorldSettingsActionTypes & AnyAction]>(),
	PlaceBlock:
		Definitions.ServerFunction<
			(position: Vector3, orien: Vector3, settings: PlacementSettings) => BasePart | undefined
		>(),
	DeleteBlock: Definitions.ServerFunction<(target: BasePart) => void>(),
	ToggleDebug: Definitions.ServerToClientEvent(),
});
