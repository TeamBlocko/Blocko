import { Action, AnyAction, createReducer } from "@rbxts/rodux";

enum ColorPickerActions {
	"UPDATE_COLOR_PICKER_ACTIVATED" = "UPDATE_COLOR_PICKER_ACTIVATED",
}

interface ActionRecievedUpdateColorPicker extends Action<ColorPickerActions.UPDATE_COLOR_PICKER_ACTIVATED> {
	activatedColorPicker: string | undefined;
}

export function updateColorPickerActivated(
	activatedColorPicker: string | undefined,
): ActionRecievedUpdateColorPicker & AnyAction {
	return {
		type: ColorPickerActions.UPDATE_COLOR_PICKER_ACTIVATED,
		activatedColorPicker,
	};
}

export const updateColorPickerReducer = createReducer<string | undefined, ActionRecievedUpdateColorPicker>(undefined, {
	[ColorPickerActions.UPDATE_COLOR_PICKER_ACTIVATED]: (_, action) => action.activatedColorPicker,
});
