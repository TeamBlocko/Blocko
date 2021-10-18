import Rodux, { Store, combineReducers, AnyAction } from "@rbxts/rodux";
import { intialState } from "./intialState";
import { WorldSettingsActionTypes, worldSettingsReducerInitlizer } from "template/shared/worldSettingsReducer";
import { placementSettingsReducer, PlacementSettingsActions } from "./rodux/placementSettings";
import { IState } from "template/shared/Types";
import { ActionRecievedUpdatePicker, updatePickerReducer } from "./rodux/updatePicker";
import { ActionRecievedToggleDebug, updateDebugReducer } from "./rodux/updateDebug";

export type StoreActions = (
	| PlacementSettingsActions
	| WorldSettingsActionTypes
	| ActionRecievedUpdatePicker
	| ActionRecievedToggleDebug
) &
	AnyAction;

export const storeReducer = combineReducers<IState, StoreActions>({
	ActivatedPicker: updatePickerReducer,
	PlacementSettings: placementSettingsReducer,
	Debug: updateDebugReducer,
	World: worldSettingsReducerInitlizer(intialState.World),
});

function loggerMiddleware(nextDispatch: Rodux.Dispatch<AnyAction>, store: IState) {
	return (action: StoreActions) => {
		if (store.Debug) {
			Rodux.loggerMiddleware(nextDispatch, store);
		}
		const result = nextDispatch(action);
		return result;
	};
}

export default new Store<IState, StoreActions, typeof Rodux.loggerMiddleware>(storeReducer, {}, [loggerMiddleware]);
