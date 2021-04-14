import Rodux, { Store, combineReducers, AnyAction } from "@rbxts/rodux";
import { intialState } from "./intialState";
import { WorldSettingsActionTypes, worldSettingsReducerInitlizer } from "template/shared/worldSettingsReducer";
import { placementSettingsReducer, PlacementSettingsActions } from "./rodux/placementSettings";
import { IState } from "template/shared/Types";

export type StoreActions = (PlacementSettingsActions | WorldSettingsActionTypes) & AnyAction;

export const storeReducer = combineReducers<IState>({
	PlacementSettings: placementSettingsReducer,
	World: worldSettingsReducerInitlizer(intialState.World),
});

export default new Store<IState, StoreActions, typeof Rodux.loggerMiddleware>(storeReducer, {}, [
	Rodux.loggerMiddleware,
]);
