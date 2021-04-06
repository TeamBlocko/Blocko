import { TextService, Workspace } from "@rbxts/services";
import Roact, { Component } from "@rbxts/roact";
import { Notification } from "./Notification";
import { ApplyPrompt } from "./ApplyPrompt";
import store from "client/notificationStore";

const camera = Workspace.CurrentCamera as Camera;

interface NotificationContainerPropTypes {
	defaultNotificationWidth: number;
}

export class NotificationContainer extends Component<
	NotificationContainerPropTypes,
	{ notifications: iNotification[] }
> {
	frameRef: Roact.Ref<ScrollingFrame>;
	timeContainer = new Map<string, boolean>();

	constructor(props: NotificationContainerPropTypes) {
		super(props);

		this.frameRef = Roact.createRef();

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

	add(notification: iNotification) {
		this.setState(({ notifications }) => ({
			notifications: [notification, ...notifications],
		}));

		return notification.Id;
	}

	remove(id: string) {
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
		this.setState({
			notifications: this.state.notifications.map((notification) => ({
				...notification,
				HasBeenRemoved: true,
			})),
		});
	}

	toggleRemoval(id: string) {
		this.setState(({ notifications }) => ({
			notifications: notifications.filter((notification) => notification.Id !== id),
		}));
	}

	renderNotifications() {
		let currentPosition = 0;

		const notifications = this.state.notifications.map((notification, index) => {
			const textSize = TextService.GetTextSize(
				notification.Message ? notification.Message.gsub("<.->", "")[0] : "",
				18,
				Enum.Font.GothamSemibold,
				new Vector2(),
			);

			const maxWidth = camera.ViewportSize.X * 0.8;
			const computedFrameSize = math.min(maxWidth, textSize.X + 80);

			const length = 50 + math.floor(computedFrameSize / maxWidth);

			if (notification.Time !== undefined && !this.timeContainer.get(notification.Id)) {
				this.timeContainer.set(notification.Id, true);
				delay(notification.Time, () => {
					this.timeContainer.delete(notification.Id);
					this.remove(notification.Id);
				});
			}

			const element = !notification.isApplyPrompt ?
				(
					<Notification
						{...notification}
						Position={new UDim2(0.5, 0, 0, currentPosition)}
						FrameSize={computedFrameSize}
						MaxWidth={camera.ViewportSize.X * 0.8}
						toggleRemoval={(id) => this.toggleRemoval(id)}
					/>
				)
			:
				(
					<ApplyPrompt
						{...notification}
						Position={new UDim2(0.5, 0, 0, currentPosition)}
						FrameSize={computedFrameSize}
						MaxWidth={camera.ViewportSize.X * 0.8}
						toggleRemoval={(id) => this.toggleRemoval(id)}
					/>
				);

			currentPosition +=
				(!notification.HasBeenRemoved ? length : 0) +
				(this.state.notifications.size() - 1 === index || notification.HasBeenRemoved ? 0 : 10);

			return element;
		});

		const frame = this.frameRef.getValue();

		if (frame !== undefined) frame.CanvasSize = UDim2.fromOffset(0, currentPosition);

		return notifications;
	}

	render() {
		return (
			<scrollingframe
				Ref={this.frameRef}
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromScale(0.8, 0.4)}
				ClipsDescendants={true}
				ScrollBarImageTransparency={0.85}
				ScrollBarThickness={3}
				CanvasSize={new UDim2()}
			>
				{this.renderNotifications()}
			</scrollingframe>
		);
	}
}
