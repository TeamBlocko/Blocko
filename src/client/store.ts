import Rodux, { Store, combineReducers, AnyAction, Middleware } from "@rbxts/rodux";
import { intialState } from "./intialState";
import { worldSettingsReducerInitlizer } from "shared/worldSettingsReducer";
// import { updateWorldSettings } from "./replicationManager";
import { WorldSettingsActions } from "shared/worldSettingsActions";
import { placementSettingsReducer, PlacementSettingsActions } from "./rodux/placementSettings";

export type StoreActions = (PlacementSettingsActions | ActionRecievedUpdateWorldSettings) & AnyAction;

export const storeReducer = combineReducers<IState>({
	PlacementSettings: placementSettingsReducer,
	WorldSettings: worldSettingsReducerInitlizer(intialState.WorldSettings),
});

export default new Store<IState, StoreActions, typeof Rodux.loggerMiddleware /*, Middleware*/>(storeReducer, {}, [
	Rodux.loggerMiddleware,
	//(dispatch) => (action) => {
	//    if (action.type === WorldSettingsActions.UPDATE_SETTINGS && !action.replcated)
	//        updateWorldSettings(action);
	//
	//    dispatch(action);

	//}
]);
