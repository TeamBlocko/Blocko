import { createReducer, AnyAction } from "@rbxts/rodux";
import { deepCopy } from "@rbxts/object-utils";
import { WorldSettingsActions } from "shared/worldSettingsActions";

export function updateWorldSettings(data: UpdateWorldSettingDataType[]): ActionRecievedUpdateWorldSettings & AnyAction {
	return {
		type: WorldSettingsActions.UPDATE_SETTINGS,
		data,
		replicateBroadcast: true,
	}
}

export const worldSettingsReducerInitlizer = (intialWorldSettings: WorldSettings) => createReducer<WorldSettings, ActionRecievedUpdateWorldSettings>
	(
		intialWorldSettings,
		{
			[WorldSettingsActions.UPDATE_SETTINGS]: (state, action) => {
				const newState = deepCopy(state);

				for (const data of action.data)
					newState[data.propertyName] = data.value as never;

				return newState;
			}
		}
)