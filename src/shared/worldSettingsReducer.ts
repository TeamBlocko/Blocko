import { createReducer, AnyAction } from "@rbxts/rodux";
import { deepCopy } from "@rbxts/object-utils";
import { WorldSettingsActions } from "shared/worldSettingsActions";

// WORLD SETTINGS
export function updateWorldSettings(data: UpdateWorldSettingDataType[]): ActionRecievedUpdateWorldSettings & AnyAction {
	return {
		type: WorldSettingsActions.UPDATE_SETTINGS,
		data,
		replicateBroadcast: true,
	};
}


// WORLD INFO
export function updateWorldInfo(data: UpdateWorldInfoDataType[]): ActionRecievedUpdateWorldInfo & AnyAction {
	return {
		type: WorldSettingsActions.UPDATE_WORLD_INFO,
		data,
		replicateBroadcast: true,
	}
}

export const worldSettingsReducerInitlizer = (intialWorldSettings: WorldInfo) =>
	createReducer<WorldInfo, WorldSettingsActionTypes>(intialWorldSettings, {
		[WorldSettingsActions.UPDATE_SETTINGS]: (state, action) => {
			const newState = deepCopy(state);

			for (const data of action.data) newState.WorldSettings[data.propertyName] = data.value as never;

			return newState;
		},
		[WorldSettingsActions.UPDATE_WORLD_INFO]: (state, action) => {
			const newState = deepCopy(state);

			for (const data of action.data) newState[data.propertyName] = data.value as never;

			return newState;
		}
	});
