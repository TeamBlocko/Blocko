import { entries } from "@rbxts/object-utils";
import { ActionRecievedUpdateWorldSettings, updateWorldSettings } from "template/shared/worldSettingsReducer";
import { deepEquals } from "@rbxts/object-utils";
import notificationStore from "common/client/notificationStore";
import { remotes } from "template/shared/remotes";
import { retriveWorldSettings } from "template/client/replicationManager";
import store from "template/client/store";
import { AnyAction } from "@rbxts/rodux";

const updateWorldSettingsRemote = remotes.Client.Get("UpdateWorldSettings");

const updateServer = (action: ActionRecievedUpdateWorldSettings & AnyAction) => {
	return updateWorldSettingsRemote.CallServer(action);
};

function parseSettings(settings: WorldSettings) {
	return updateWorldSettings(entries(settings).map(([propertyName, value]) => ({ propertyName, value })));
}

store.changed.connect(() => {
	task.spawn(() => {
		const worldSettings = retriveWorldSettings().Settings;
		const currentWorldSettings = store.getState().World.Settings;
		if (currentWorldSettings.Name.size() < 6) {
			notificationStore.removeNotification("ApplyPrompt");
			notificationStore.addNotification({
				Id: "WorldSettings",
				Message: "Name must be at least 6 characters long.",
				Time: 5,
			});
			return;
		}
		if (currentWorldSettings.Description.size() < 6) {
			notificationStore.removeNotification("ApplyPrompt");
			notificationStore.addNotification({
				Id: "WorldSettings",
				Message: "Description must be at least 6 characters long.",
				Time: 5,
			});
			return;
		}

		if (!deepEquals(worldSettings, currentWorldSettings)) {
			notificationStore.removeNotification("WorldSettings");
			notificationStore.addNotification({
				Id: "ApplyPrompt",
				isApplyPrompt: true,
				OnCancelPrompt: () => {
					print("CANCEL");
					notificationStore.removeNotification("ApplyPrompt");
					store.dispatch(parseSettings(worldSettings));
				},
				OnApplyPrompt: () => {
					print("APPLY");
					notificationStore.removeNotification("ApplyPrompt");
					notificationStore.addNotification({
						Id: "Syncing",
						Title: "",
						Message: "Syncing World Settings",
					});
					updateServer(parseSettings(store.getState().World.Settings));
					notificationStore.removeNotification("Syncing");
					notificationStore.addNotification({
						Id: "Syncing",
						Title: "",
						Message: "Done Syncing",
						Time: 5,
					});
				},
			});
		} else {
			notificationStore.removeNotification("ApplyPrompt");
		}
	});
});
