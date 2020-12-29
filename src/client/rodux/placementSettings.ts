import { createReducer, Action, AnyAction } from "@rbxts/rodux";
import { intialPlacementSettings } from "client/intialState";

export enum ActionTypes {
	UPDATE_PROPERTY = "UPDATE_PROPERTY",
}

export type PlacementSettingsActions = ActionRecievedUpdateProperty;

export interface UpdatePropertyDataType {
	readonly propertyName: string;
	readonly value: unknown;
}

export interface ActionRecievedUpdateProperty extends Action<ActionTypes.UPDATE_PROPERTY> {
	readonly data: UpdatePropertyDataType;
}

export function updateProperty(data: UpdatePropertyDataType): ActionRecievedUpdateProperty & AnyAction {
	return {
		type: ActionTypes.UPDATE_PROPERTY,
		data: data,
	};
}

export const placementSettingsReducer = createReducer<PlacementSettings, PlacementSettingsActions>(
	intialPlacementSettings,
	{
		[ActionTypes.UPDATE_PROPERTY]: (state, action) => {
			const newState = Object.copy(state);

			newState[action.data.propertyName] = action.data.value;

			return newState;
		},
	},
);
