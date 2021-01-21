import { ClientEvent } from "@rbxts/net";
import { t } from "@rbxts/t";
import { $terrify } from "rbxts-transformer-t";
import notificationStore from "./notificationStore";

function handleNotification(notification: RemoteNotification) {
	if (notification.Type === "Add")
		notificationStore.addNotification(notification.Data)
	else if (notification.Type === "Remove")
		notificationStore.removeNotification(notification.Data)
}

const remoteNotification = $terrify<RemoteNotification>();

ClientEvent.WaitFor("NotificationManager").andThen((remote) => remote.Connect((data: RemoteNotification | RemoteNotification[]) => {
	print(1)
	if (remoteNotification(data)) {
		print(2)
		handleNotification(data);
	} else if (t.array(remoteNotification)(data)) {
		print(3)
		for (const notification of data) handleNotification(notification);
	}
}))