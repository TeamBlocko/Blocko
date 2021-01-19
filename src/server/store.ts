import { Middleware, Store } from "@rbxts/rodux";
import { replicate } from "./replicate";
import { networkMiddlewareInitlizer } from "./networkMiddleware";
import { worldSettingsReducerInitlizer } from "shared/worldSettingsReducer";

export const storeInitializer = (intialWorldSettings: WorldInfo) =>
	new Store<WorldInfo, WorldSettingsActionTypes, [Middleware]>(
		worldSettingsReducerInitlizer(intialWorldSettings),
		intialWorldSettings,
		[networkMiddlewareInitlizer(replicate)],
	);
