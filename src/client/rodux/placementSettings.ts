import { createReducer, Action, AnyAction } from "@rbxts/rodux";
import { deepCopy, values } from "@rbxts/object-utils";
import { intialPlacementSettings } from "client/intialState";
import * as Functionalities from "shared/Functionalities";
import { PlacementSettings } from "shared/Types";

export enum ActionTypes {
	UPDATE_PROPERTY = "UPDATE_PROPERTY",
	UPDATE_SETTINGS = "UPDATE_SETTINGS",
	UPDATE_FUNCTIONALITY = "UPDATE_FUNCTIONALITY",
	UPDATE_FUNCTIONALITY_PROPERTY = "UPDATE_FUNCTIONALITY_PROPERTY",
}

export type PlacementSettingsActions =
	| ActionRecievedUpdateProperty
	| ActionRecievedUpdateSettings
	| ActionRecievedUpdateFunctionality
	| ActionRecievedUpdateFunctionalityProperty;

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

//UPDATE FUNCTIONALITY
export interface ActionRecievedUpdateFunctionality extends Action<ActionTypes.UPDATE_FUNCTIONALITY> {
	guid: string;
	value: Functionalities.FunctionalitiesInstances;
}

export function updateFunctionality(
	guid: string,
	value: Functionalities.FunctionalitiesInstances,
): ActionRecievedUpdateFunctionality & AnyAction {
	return {
		type: ActionTypes.UPDATE_FUNCTIONALITY,
		guid,
		value,
	};
}

//UPDATE FUNCTIONALITY PROPERTY
export interface ActionRecievedUpdateFunctionalityProperty extends Action<ActionTypes.UPDATE_FUNCTIONALITY_PROPERTY> {
	guid: string;
	property: string;
	value: number;
}

export function updateFunctionalityProperty(
	guid: string,
	property: string,
	value: number,
): ActionRecievedUpdateFunctionalityProperty & AnyAction {
	return {
		type: ActionTypes.UPDATE_FUNCTIONALITY_PROPERTY,
		guid,
		property,
		value,
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

			newState[action.data.settingName] = action.data.value as never;

			return newState;
		},
		[ActionTypes.UPDATE_FUNCTIONALITY]: (state, action) => {
			const newState = deepCopy(state);

			const functionalityIndex = newState.Functionalities.findIndex(
				(functionality) => functionality.GUID === action.guid,
			);

			newState.Functionalities[functionalityIndex] = action.value;

			return newState;
		},
		[ActionTypes.UPDATE_FUNCTIONALITY_PROPERTY]: (state, action) => {
			const newState = deepCopy(state);

			const functionality = newState.Functionalities.find((functionality) => functionality.GUID === action.guid);

			if (!functionality) return newState;

			const property = (values(
				functionality.Properties,
			) as Functionalities.FunctionalitiesPropertiesInstance[]).find(
				(property) => property.Name === action.property,
			);

			if (!property) return newState;

			property.Current = action.value;

			return newState;
		},
	},
);
