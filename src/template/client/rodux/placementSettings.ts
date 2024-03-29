import { createReducer, Action, AnyAction, combineReducers } from "@rbxts/rodux";
import { assign, copy as shallowCopy } from "@rbxts/object-utils";
import { intialPlacementSettings } from "template/client/intialState";
import * as Functionalities from "template/shared/Functionalities";
import { PlacementSettings } from "template/shared/Types";

export enum ActionTypes {
	UPDATE_PROPERTY = "UPDATE_PROPERTY",
	UPDATE_FUNCTIONALITY = "UPDATE_FUNCTIONALITY",
	UPDATE_FUNCTIONALITY_PROPERTY = "UPDATE_FUNCTIONALITY_PROPERTY",
	UPDATE_BASE_PART = "UPDATE_BASE_PART",
	UPDATE_BUILD_MODE = "UPDATE_BUILD_MODE",
	ADD_FUNCTIONALITY = "ADD_FUNCTIONALITY",
	REMOVE_FUNCTIONALITY = "REMOVE_FUNCTIONALITY",
}

export type PlacementSettingsActions =
	| ActionRecievedUpdateProperty
	| ActionRecievedAddFunctionality
	| ActionRecievedUpdateFunctionality
	| ActionRecievedUpdateFunctionalityProperty
	| ActionRecievedRemoveFunctionality
	| UpdateBasePart
	| UpdateBuildMode;

//UPDATE PROPERTY
type ValueOfRawProperties = ValueOf<RawProperties>;

export interface UpdatePropertyDataType {
	readonly propertyName: keyof RawProperties;
	readonly value: ValueOfRawProperties;
}

interface ActionRecievedUpdateProperty extends Action<ActionTypes.UPDATE_PROPERTY> {
	readonly data: UpdatePropertyDataType[];
}

export function updateProperty(data: UpdatePropertyDataType[]): ActionRecievedUpdateProperty & AnyAction {
	return {
		type: ActionTypes.UPDATE_PROPERTY,
		data,
	};
}

//UPDATE FUNCTIONALITY
interface ActionRecievedUpdateFunctionality extends Action<ActionTypes.UPDATE_FUNCTIONALITY> {
	guid: string;
	value: Functionalities.FunctionalitiesInstancesValues;
}

export function updateFunctionality(
	guid: string,
	value: Functionalities.FunctionalitiesInstancesValues,
): ActionRecievedUpdateFunctionality & AnyAction {
	return {
		type: ActionTypes.UPDATE_FUNCTIONALITY,
		guid,
		value,
	};
}

//UPDATE FUNCTIONALITY PROPERTY
interface ActionRecievedUpdateFunctionalityProperty extends Action<ActionTypes.UPDATE_FUNCTIONALITY_PROPERTY> {
	guid: string;
	property: Functionalities.FunctionalitiesPropertiesNames;
	value: Functionalities.FunctionalitiesPropertiesValueTypes;
}

export function updateFunctionalityProperty(
	guid: string,
	property: Functionalities.FunctionalitiesPropertiesNames,
	value: Functionalities.FunctionalitiesPropertiesValueTypes,
): ActionRecievedUpdateFunctionalityProperty & AnyAction {
	return {
		type: ActionTypes.UPDATE_FUNCTIONALITY_PROPERTY,
		guid,
		property,
		value,
	};
}

interface ActionRecievedAddFunctionality extends Action<ActionTypes.ADD_FUNCTIONALITY> {
	functionality: Functionalities.FunctionalitiesInstancesValues;
}

export function addFunctionality(
	functionality: Functionalities.FunctionalitiesInstancesValues,
): ActionRecievedAddFunctionality & AnyAction {
	return {
		type: ActionTypes.ADD_FUNCTIONALITY,
		functionality,
	};
}

interface ActionRecievedRemoveFunctionality extends Action<ActionTypes.REMOVE_FUNCTIONALITY> {
	guid: string;
}

export function removeFunctionality(guid: string): ActionRecievedRemoveFunctionality & AnyAction {
	return {
		type: ActionTypes.REMOVE_FUNCTIONALITY,
		guid,
	};
}

//----

interface UpdateBasePart extends Action<ActionTypes.UPDATE_BASE_PART> {
	value: BasePart;
}

export function UpdateBasePart(value: BasePart): UpdateBasePart & AnyAction {
	return {
		type: ActionTypes.UPDATE_BASE_PART,
		value,
	};
}

interface UpdateBuildMode extends Action<ActionTypes.UPDATE_BUILD_MODE> {
	value: BuildMode;
}

export function UpdateBuildMode(value: BuildMode): UpdateBuildMode & AnyAction {
	return {
		type: ActionTypes.UPDATE_BUILD_MODE,
		value,
	};
}

type FunctionalitiesActions =
	| ActionRecievedUpdateFunctionality
	| ActionRecievedUpdateFunctionalityProperty
	| ActionRecievedAddFunctionality
	| ActionRecievedRemoveFunctionality;

export const placementSettingsReducer = combineReducers<
	PlacementSettings,
	UpdateBasePart | UpdateBuildMode | FunctionalitiesActions | ActionRecievedUpdateProperty
>({
	Shape: createReducer<BasePart, UpdateBasePart>(intialPlacementSettings.Shape, {
		[ActionTypes.UPDATE_BASE_PART]: (_, action) => action.value,
	}),
	BuildMode: createReducer<BuildMode, UpdateBuildMode>(intialPlacementSettings.BuildMode, {
		[ActionTypes.UPDATE_BUILD_MODE]: (_, action) => action.value,
	}),
	Functionalities: createReducer<Functionalities.FunctionalitiesInstancesValues[], FunctionalitiesActions>([], {
		[ActionTypes.UPDATE_FUNCTIONALITY]: (state, action) =>
			state.map((functionality) => (functionality.GUID === action.guid ? action.value : functionality)),
		[ActionTypes.UPDATE_FUNCTIONALITY_PROPERTY]: (state, action) =>
			state.map((functionality) => {
				if (functionality.GUID === action.guid)
					assign((functionality.Properties as Functionalities.IntersectionProperties)[action.property], {
						Current: action.value,
					});
				return functionality;
			}),
		[ActionTypes.ADD_FUNCTIONALITY]: (state, action) => {
			const newState = shallowCopy(state);

			newState.push(action.functionality);

			return newState;
		},
		[ActionTypes.REMOVE_FUNCTIONALITY]: (state, action) => {
			const newState = shallowCopy(state);

			const functionalityIndex = newState.findIndex((functionality) => functionality.GUID === action.guid);
			newState.unorderedRemove(functionalityIndex);

			return newState;
		},
	}),
	RawProperties: createReducer<RawProperties, ActionRecievedUpdateProperty>(intialPlacementSettings.RawProperties, {
		[ActionTypes.UPDATE_PROPERTY]: (state, action) => {
			const newState = shallowCopy(state);

			for (const data of action.data) newState[data.propertyName] = data.value as never;

			return newState;
		},
	}),
});
