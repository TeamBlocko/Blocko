interface iStore {
	addNotification(notification: iNotification): string;
	removeNotification(id: string): void;
	register(param: iRegisterParams): void;
}

interface iRegisterParams {
	addNotification: (notification: iNotification) => string;
	removeNotification: (id: string) => void;
	removeAllNotifications: () => void;
	defaultNotificationWidth: number;
}

class Store implements iStore {
	constructor() {
		this.counter = 0;
	}

	public removeNotification!: (id: string) => void;
	public removeAllNotifications!: () => void;

	private add!: (notification: iNotification) => string;
	private defaultNotificationWidth!: number;
	private counter: number;

	private incrementCounter = () => (this.counter += 1);

	public addNotification(notification: iNotification) {
		this.incrementCounter();

		return this.add(notification);
	}

	public getCounter = () => this.counter;

	public register(parameters: iRegisterParams) {
		const { addNotification, removeNotification, removeAllNotifications, defaultNotificationWidth } = parameters;

		this.add = addNotification;
		this.removeNotification = removeNotification;
		this.removeAllNotifications = removeAllNotifications;
		this.defaultNotificationWidth = defaultNotificationWidth;
	}
}

export default new Store();
