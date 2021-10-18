import { Action, AnyAction, createReducer } from "@rbxts/rodux";

enum PickerActions {
	"UPDATE_PICKER_ACTIVATED" = "UPDATE_PICKER_ACTIVATED",
}

export interface ActionRecievedUpdatePicker extends Action<PickerActions.UPDATE_PICKER_ACTIVATED> {
	activatedPicker: string | undefined;
}

export function updatePickerActivated(
	activatedPicker: string | undefined,
): ActionRecievedUpdatePicker & AnyAction {
	return {
		type: PickerActions.UPDATE_PICKER_ACTIVATED,
		activatedPicker,
	};
}

export const updatePickerReducer = createReducer<string | undefined, ActionRecievedUpdatePicker>(undefined, {
	[PickerActions.UPDATE_PICKER_ACTIVATED]: (_, action) => action.activatedPicker,
});
