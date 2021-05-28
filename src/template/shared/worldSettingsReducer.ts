import { createReducer, AnyAction, combineReducers } from "@rbxts/rodux";
import { assign, copy as shallowCopy } from "@rbxts/object-utils";

export enum WorldSettingsActions {
	UPDATE_SETTINGS = "UPDATE_WORLD_SETTINGS",
	UPDATE_WORLD_INFO = "UPDATE_WORLD_INFO",
	UPDATE_PERMISSION = "UPDATE_PERMISSION",
}

export type WorldSettingsActionTypes =
	| ActionRecievedUpdateWorldSettings
	| ActionRecievedUpdateWorldInfo
	| ActionRecievedUpdatePermission;

interface Replicate<T> extends Rodux.Action<T> {
	readonly replicateBroadcast?: boolean;
	readonly replicateTo?: number;
	readonly replicated?: boolean;
}

// WORLD SETTINGS

export interface UpdateWorldSettingDataType {
	readonly propertyName: keyof WorldSettings;
	readonly value: string | number | boolean | Color3;
}

export interface ActionRecievedUpdateWorldSettings extends Replicate<WorldSettingsActions.UPDATE_SETTINGS> {
	readonly data: UpdateWorldSettingDataType[];
}

export function updateWorldSettings(data: UpdateWorldSettingDataType[]): ActionRecievedUpdateWorldSettings & AnyAction {
	return {
		type: WorldSettingsActions.UPDATE_SETTINGS,
		data,
		replicateBroadcast: true,
	};
}

//-- PERMISSIONS

interface ActionRecievedUpdatePermission extends Replicate<WorldSettingsActions.UPDATE_PERMISSION> {
	userId: number;
	permissionLevel: PermissionTypes;
}

export function updateWorldPermission(
	userId: number,
	permissionLevel: PermissionTypes,
): ActionRecievedUpdatePermission & AnyAction {
	return {
		type: WorldSettingsActions.UPDATE_PERMISSION,
		userId,
		permissionLevel,
		replicateBroadcast: true,
	};
}

// WORLD INFO

interface UpdateWorldInfoDataType {
	readonly propertyName: keyof WorldInfo;
	readonly value: string | number | number[];
}

export interface ActionRecievedUpdateWorldInfo extends Replicate<WorldSettingsActions.UPDATE_WORLD_INFO> {
	readonly data: UpdateWorldInfoDataType[];
}

export function updateWorldInfo(data: UpdateWorldInfoDataType[]): ActionRecievedUpdateWorldInfo & AnyAction {
	return {
		type: WorldSettingsActions.UPDATE_WORLD_INFO,
		data,
		replicateBroadcast: true,
	};
}

type InfoActions = ActionRecievedUpdateWorldInfo | ActionRecievedUpdatePermission;

export const worldSettingsReducerInitlizer = (intialWorldSettings: World) =>
	combineReducers<World>({
		Info: createReducer<WorldInfo, InfoActions>(intialWorldSettings.Info, {
			[WorldSettingsActions.UPDATE_WORLD_INFO]: (state, action) => {
				const newState = shallowCopy(state);

				for (const data of action.data) newState[data.propertyName] = data.value as never;

				return newState;
			},
			[WorldSettingsActions.UPDATE_PERMISSION]: (state, action) => {
				const newState = shallowCopy(state);

				const userPermission = newState.Permissions.find(permission => permission.UserId === action.userId)
				if (userPermission) {
					userPermission.Type = action.permissionLevel
				} else {
					newState.Permissions.push({ UserId: action.userId, Type: action.permissionLevel })
				}

				return newState;
			},
		}),
		Settings: createReducer<WorldSettings, ActionRecievedUpdateWorldSettings>(intialWorldSettings.Settings, {
			[WorldSettingsActions.UPDATE_SETTINGS]: (state, action) => {
				const newState = shallowCopy(state);

				for (const data of action.data) newState[data.propertyName] = data.value as never;

				return newState;
			},
		}),
	});
