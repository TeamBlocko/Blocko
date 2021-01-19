import { createReducer, Action, AnyAction } from "@rbxts/rodux";
import { deepCopy } from "@rbxts/object-utils";
import { intialPlacementSettings } from "client/intialState";

export enum ActionTypes {
	UPDATE_PROPERTY = "UPDATE_PROPERTY",
	UPDATE_SETTINGS = "UPDATE_SETTINGS",
}

export type PlacementSettingsActions = ActionRecievedUpdateProperty | ActionRecievedUpdateSettings;

//UPDATE PROPERTY
type ValueOfRawProperties = ValueOf<RawProperties>;

export interface UpdatePropertyDataType {
	readonly propertyName: keyof RawProperties;
	readonly value: ValueOfRawProperties;
}

export interface ActionRecievedUpdateProperty extends Action<ActionTypes.UPDATE_PROPERTY> {
	readonly data: UpdatePropertyDataType[];
}

export function updateProperty(data: UpdatePropertyDataType[]): ActionRecievedUpdateProperty & AnyAction {
	return {
		type: ActionTypes.UPDATE_PROPERTY,
		data,
	};
}

//UPDATE SETTINGS
type ValueOfPlacementSettings = ValueOf<PlacementSettings>;

export interface UpdateSettingDataType {
	readonly settingName: keyof PlacementSettings;
	readonly value: ValueOfPlacementSettings;
}

export interface ActionRecievedUpdateSettings extends Action<ActionTypes.UPDATE_SETTINGS> {
	readonly data: UpdateSettingDataType;
}

export function updateSetting(data: UpdateSettingDataType): ActionRecievedUpdateSettings & AnyAction {
	return {
		type: ActionTypes.UPDATE_SETTINGS,
		data,
	};
}

//-------------------
export const placementSettingsReducer = createReducer<PlacementSettings, PlacementSettingsActions>(
	intialPlacementSettings,
	{
		[ActionTypes.UPDATE_PROPERTY]: (state, action) => {
			const newState = deepCopy(state);

			for (const data of action.data) newState.RawProperties[data.propertyName] = data.value as never;

			return newState;
		},
		[ActionTypes.UPDATE_SETTINGS]: (state, action) => {
			const newState = deepCopy(state);

			newState[action.data.settingName] = action.data.value as BasePart & RawProperties & BuildMode;

			return newState;
		},
	},
);
