import Roact from "@rbxts/roact";
import { NotificationContainer } from "./components/NotificationContainer";
import notificationStore from "./notificationStore";

export = (target: GuiBase2d | PlayerGui) => {
	const handle = Roact.mount(<NotificationContainer defaultNotificationWidth={0} />, target);

	delay(5, () => {
		notificationStore.addNotification({
			Id:"LoL!",
			Message: "WowWWW Letsss Go Mario!!",
			Icon: "rbxassetid://5995661677",
		})
		notificationStore.addNotification({
			Id:"LoL2!",
			isApplyPrompt: true,
			Message: "Hey hazem. can you fix the dorpdown issue, hey hazem can you fix the dropdown issue, hey hazem can you-",
			Icon: "rbxassetid://5995661677",
		})
		notificationStore.addNotification({
			Id:"LoL3!",
			Message: "Hey hazem. can you fix the dorpdown issue, hey hazem can you fix the dropdown issue, hey hazem can you-",
			Icon: "rbxassetid://5995661677",
		})

		delay(5, () => {
			notificationStore.removeNotification("LoL2!");
		})
	})

	return () => {
		Roact.unmount(handle);
	};
};
