import Rodux, { Store, combineReducers, AnyAction } from "@rbxts/rodux";
import { intialState } from "./intialState";
import { worldSettingsReducerInitlizer } from "shared/worldSettingsReducer";
import { placementSettingsReducer, PlacementSettingsActions } from "./rodux/placementSettings";
import { IState } from "shared/Types";

export type StoreActions = (PlacementSettingsActions | WorldSettingsActionTypes) & AnyAction;

export const storeReducer = combineReducers<IState>({
	PlacementSettings: placementSettingsReducer,
	WorldInfo: worldSettingsReducerInitlizer(intialState.WorldInfo),
});

export default new Store<IState, StoreActions, typeof Rodux.loggerMiddleware>(storeReducer, {}, [
	Rodux.loggerMiddleware,
]);
