import Rodux, { Store, combineReducers, AnyAction } from "@rbxts/rodux";
import { placementSettingsReducer, PlacementSettingsActions } from "./rodux/placementSettings";

export type StoreActions = PlacementSettingsActions & AnyAction;

export const storeReducer = combineReducers<IState>({
	PlacementSettings: placementSettingsReducer,
});

export default new Store<IState, StoreActions, [typeof Rodux.loggerMiddleware]>(storeReducer, {}, [
	Rodux.loggerMiddleware,
]);
