import { Definitions } from "@rbxts/net";

export const remotes = Definitions.Create({
	NotificationManager: Definitions.ServerToClientEvent<[RemoteNotification | RemoteNotification[]]>(),
});
