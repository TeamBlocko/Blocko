import { Action, AnyAction, createReducer } from "@rbxts/rodux";

enum DebugActions {
	"UPDATE_DEBUG_ACTIVATED" = "UPDATE_DEBUG_ACTIVATED",
}

export interface ActionRecievedToggleDebug extends Action<DebugActions.UPDATE_DEBUG_ACTIVATED> {}

export function toggleDebug(): ActionRecievedToggleDebug & AnyAction {
	return {
		type: DebugActions.UPDATE_DEBUG_ACTIVATED,
	};
}

export const updateDebugReducer = createReducer<boolean, ActionRecievedToggleDebug>(false, {
	[DebugActions.UPDATE_DEBUG_ACTIVATED]: (value) => !value,
});
