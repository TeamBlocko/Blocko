import { Client } from "@rbxts/net";
import { t } from "@rbxts/t";
import { $terrify } from "rbxts-transformer-t";
import notificationStore from "./notificationStore";

function handleNotification(notification: RemoteNotification) {
	if (notification.Type === "Add") notificationStore.addNotification(notification.Data);
	else if (notification.Type === "Remove") notificationStore.removeNotification(notification.Id);
}

const remoteNotification = $terrify<RemoteNotification>();

Client.Event.Wait<[data: RemoteNotification | RemoteNotification[]]>("NotificationManager").andThen((remote) =>
	remote.Connect((data) => {
		if (remoteNotification(data)) {
			handleNotification(data);
		} else if (t.array(remoteNotification)(data)) {
			for (const notification of data) handleNotification(notification);
		}
	}),
);
