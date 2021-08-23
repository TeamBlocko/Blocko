import { TextService, Workspace } from "@rbxts/services";
import Roact, { Component } from "@rbxts/roact";
import { Notification } from "./Notification";
import { ApplyPrompt } from "./ApplyPrompt";
import store from "common/client/notificationStore";

const camera = Workspace.CurrentCamera as Camera;

interface NotificationContainerPropTypes {
	defaultNotificationWidth: number;
}

export class NotificationContainer extends Component<
	NotificationContainerPropTypes,
	{ notifications: iNotification[] }
> {
	timeContainer = new Map<string, boolean>();

	constructor(props: NotificationContainerPropTypes) {
		super(props);

		this.setState({
			notifications: [],
		});
	}

	didMount() {
		const { defaultNotificationWidth } = this.props;

		store.register({
			addNotification: (notification) => this.add(notification),
			removeNotification: (id) => this.remove(id),
			removeAllNotifications: () => this.removeAllNotifications(),
			defaultNotificationWidth,
		});
	}

	hasNotification(id: string) {
		return this.state.notifications.some((notifcation) => notifcation.Id === id);
	}

	add(notification: iNotification) {
		if (this.hasNotification(notification.Id) && !notification.OverridePrevious) return notification.Id;
		this.remove(notification.Id);
		if (notification.Time) {
			this.timeContainer.set(notification.Id, true);
			delay(notification.Time, () => {
				if (this.timeContainer.get(notification.Id)) {
					this.timeContainer.delete(notification.Id);
					this.remove(notification.Id);
				}
			});
		}
		this.setState(({ notifications }) => ({
			notifications: [notification, ...notifications],
		}));

		return notification.Id;
	}

	remove(id: string) {
		this.timeContainer.delete(id);
		this.setState(({ notifications }) => ({
			notifications: notifications.map((notification) => {
				if (notification.Id === id) {
					notification.HasBeenRemoved = true;
				}

				return notification;
			}),
		}));
	}

	removeAllNotifications() {
		this.timeContainer.clear();
		this.setState(({ notifications }) => ({
			notifications: notifications.map((notification) => ({
				...notification,
				HasBeenRemoved: true,
			})),
		}));
	}

	toggleRemoval(id: string) {
		this.setState(({ notifications }) => ({
			notifications: notifications.filter((notification) => notification.Id !== id),
		}));
	}

	renderNotifications() {
		const notifications = this.state.notifications.map((notification) => {
			const textSize = TextService.GetTextSize(
				notification.Message !== undefined ? notification.Message.gsub("<.->", "")[0] : "",
				18,
				Enum.Font.GothamSemibold,
				new Vector2(),
			);

			const maxWidth = camera.ViewportSize.X * 0.8;
			const computedFrameSize = math.min(maxWidth, textSize.X + 80);

			const element = !notification.isApplyPrompt ? (
				<Notification
					{...notification}
					FrameSize={computedFrameSize}
					MaxWidth={camera.ViewportSize.X * 0.8}
					toggleRemoval={(id) => this.toggleRemoval(id)}
				/>
			) : (
				<ApplyPrompt
					{...notification}
					FrameSize={computedFrameSize}
					MaxWidth={camera.ViewportSize.X * 0.8}
					toggleRemoval={(id) => this.toggleRemoval(id)}
				/>
			);
			return element;
		});

		return notifications;
	}

	render() {
		return (
			<frame
				Key={"NotificationContainer"}
				AnchorPoint={new Vector2(0, 1)}
				BackgroundTransparency={1}
				Position={new UDim2(0, 15, 1, -15)}
				AutomaticSize={Enum.AutomaticSize.XY}
				ClipsDescendants={true}
				ZIndex={2}
			>
				<uilistlayout VerticalAlignment={Enum.VerticalAlignment.Bottom} Padding={new UDim(0, 10)} />
				{this.renderNotifications()}
			</frame>
		);
	}
}
