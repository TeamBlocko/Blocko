import { Client } from "@rbxts/net";
import { t } from "@rbxts/t";
import notificationStore from "./notificationStore";

function handleNotification(notification: RemoteNotification) {
	if (notification.Type === "Add") notificationStore.addNotification(notification.Data);
	else if (notification.Type === "Remove") notificationStore.removeNotification(notification.Id);
}

const remoteNotification = t.union(
	t.interface({
		Type: t.literal("Add"),
		Data: t.intersection(
			t.interface({
				OnRemoval: t.optional(t.callback),
				Title: t.optional(t.string),
				Message: t.optional(t.string),
				Width: t.optional(t.number),
				HasBeenRemoved: t.optional(t.boolean),
				Icon: t.optional(t.string),
				isApplyPrompt: t.optional(t.boolean),
				OnCancelPrompt: t.optional(t.callback),
				OnApplyPrompt: t.optional(t.callback),
				Time: t.optional(t.number),
			}),
			t.interface({
				Id: t.string,
			}),
		),
	}),
	t.interface({
		Type: t.literal("Remove"),
		Id: t.string,
	}),
);

Client.Event.Wait<[data: RemoteNotification | RemoteNotification[]]>("NotificationManager").andThen((remote) =>
	remote.Connect((data) => {
		if (remoteNotification(data)) {
			handleNotification(data);
		} else if (t.array(remoteNotification)(data)) {
			for (const notification of data) handleNotification(notification);
		}
	}),
);
