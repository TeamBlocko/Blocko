import { Middleware, Store, AnyAction } from "@rbxts/rodux";
import { replicate } from "./replicate";
import { networkMiddlewareInitlizer } from "./roduxMiddlewares/networkMiddleware";
import { WorldSettingsActionTypes, worldSettingsReducerInitlizer } from "template/shared/worldSettingsReducer";

export const storeInitializer = (intialWorldSettings: World) =>
	new Store<World, WorldSettingsActionTypes & AnyAction, [Middleware]>(
		worldSettingsReducerInitlizer(intialWorldSettings),
		intialWorldSettings,
		[networkMiddlewareInitlizer(replicate)],
	);
