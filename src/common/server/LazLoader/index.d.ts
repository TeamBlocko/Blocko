// Loader TypeScript typings for Roblox-TS
export = Loader;
export as namespace Loader;

declare namespace Loader {
	class Subscription {
		Unsubscribe(): Subscription;
	}

	class DataSyncFile<T> {
		Loaded(): boolean;
		Ready(): boolean;
		GetData<K extends string>(value?: K | number): K extends keyof T ? T[K] : T & { __IsReady: boolean };

		UpdateData<K extends keyof T>(key: K, value: T[K]): this;
		UpdateData(value: T): this;

		IncrementData(value: string, num: number): this;
		SaveData(): this;
		RemoveData(): this;
		WipeData(): this;
	}

	class SubscriptionContents {
		Value: any;
	}

	class DataSyncStore<T> {
		FilterKeys(keys: Array<string>, filter: boolean | void): this;
		GetFile(index: string | number | void): DataSyncFile<T>;
		Subscribe(
			index: string | number | Player,
			value: string | Array<string>,
			code: (data: SubscriptionContents) => void,
		): Subscription;
	}

	interface DataSync {
		GetStore: <T>(key: string, data?: T) => DataSyncStore<T>;
	}

	interface Connection {
		Disconnect(): this;
		Fire(...args: unknown[]): this;
	}

	interface Scheduler {
		Enabled(): boolean;
		Pause(): number;
		Resume(): number;
		Wait(): number;
		Disconnect(): this;
		Queue(code: () => void): void;
	}

	interface Manager {
		IsStudio: boolean;
		IsServer: boolean;
		IsClient: boolean;
		IsRunMode: boolean;

		Set: (properties: Map<string, Array<unknown>>) => void;
		Wait: (clock: number) => number;
		Wrap: (code: () => void) => void;
		Spawn: (code: () => void, ...args: unknown[]) => void;
		Loop: (code: () => void, ...args: unknown[]) => void;
		Delay: (clock: number, code: () => void, ...args: unknown[]) => void;
		Garbage: (clock: number, obj: Instance) => void;
		Retry: (clock: number, code: () => void, ...args: unknown[]) => boolean & unknown;
		Rerun: (times: number, code: () => void, ...args: unknown[]) => boolean & unknown;
		Debounce: (key: any, code: () => void, ...args: unknown[]) => boolean & unknown;
		Debug: (label?: string) => void;
		Round: (input: number, decimal?: number) => number;

		FormatCounter: (input: number, decimal: number) => string;
		FormatValue: (input: number) => string;
		FormatMoney: (input: number) => string;
		FormatClock: (input: number) => string;
		Format24H: (input: number) => string;
		FormatDate: (input: number) => string;

		Tween: (
			object: Instance,
			properties: Map<string, Array<unknown>>,
			goals: unknown | Array<unknown>,
			duration?: number,
			style?: EnumItem,
			direction?: EnumItem,
		) => Tween;

		Count: (master: Map<unknown, unknown> | Array<unknown>) => number;
		Copy: (master: Map<unknown, unknown> | Array<unknown>) => Map<unknown, unknown> | Array<unknown>;
		DeepCopy: (master: Map<unknown, unknown> | Array<unknown>) => Map<unknown, unknown> | Array<unknown>;
		Shuffle: (master: Map<unknown, unknown> | Array<unknown>) => Map<unknown, unknown> | Array<unknown>;
		Encode: (data: unknown) => unknown | void;
		Decode: (text: string) => unknown | void;

		WaitForTag: (tag: string) => Array<unknown>;
		WaitForCharacter: (player: Player) => Instance;

		Connect: (code: RBXScriptConnection | Array<unknown> | (() => void)) => Connection;
		ConnectKey: (code: RBXScriptConnection | Array<unknown> | (() => void)) => Connection;
		FireKey: (key: unknown, ...args: unknown[]) => void;
		DisconnectKey: (key: unknown) => void;
		Task: (targetFPS?: number) => Scheduler;
	}

	interface Network {
		CreateEvent: (name: string) => RemoteEvent;
		CreateFunction: (name: string) => RemoteFunction;
		CreateBindableEvent: (name: string) => BindableEvent;
		CreateBindableFunction: (name: string) => BindableFunction;

		HookEvent(name: string, code: (...args: unknown[]) => void): RemoteEvent;
		HookFunction(name: string, code: (...args: unknown[]) => void): RemoteFunction;
		UnhookEvent(): boolean;
		UnhookFunction(): boolean;

		FireServer: (name: string, ...args: unknown[]) => void;
		FireClient: (name: string, client: Player, ...args: unknown[]) => void;
		FireClients: (name: string, clients: Array<Player>, ...args: unknown[]) => void;
		FireAllClients: (name: string, ...args: unknown[]) => void;

		InvokeServer(name: string, ...args: unknown[]): unknown[];
		InvokeClient(name: string, client: Player, ...args: unknown[]): unknown[];
		InvokeAllClients(name: string, ...args: unknown[]): unknown[];

		BindEvent(name: string): BindableEvent;
		BindFunction(name: string): BindableFunction;
		UnbindEvent(name: string): boolean;
		UnbindFunction(name: string): boolean;

		FireBindable: (name: string, ...args: unknown[]) => void;
		InvokeBindable(name: string, ...args: unknown[]): unknown[];
	}

	class AssignSizesObject {
		Update(scale: number, min: number, max: number): this;
		Changed(code: () => void): this;
		Disconnect(): this;
	}

	class RichTextObject {
		Append(value: string | Array<unknown>): this;
		Bold(state: boolean): this;
		Italic(state: boolean): this;
		Underline(state: boolean): this;
		Strike(state: boolean): this;
		Comment(state: boolean): this;
		Font(state: string | EnumItem | boolean): this;
		Size(number: number | boolean): this;
		Color(color: Color3 | boolean): this;
		GetRaw(): string;
		GetText(): string;
	}

	class KeybindObject {
		Enabled(state: boolean): void;
		Keybinds(...args: EnumItem[]): void;
		Mobile(state: boolean, image: string | void): void;
		Hook(code: () => void): void;
		Destroy(): void;
	}

	interface Interface {
		IsComputer: () => boolean;
		IsMobile: () => boolean;
		IsConsole: () => boolean;
		IsKeyboard: () => boolean;
		IsMouse: () => boolean;
		IsTouch: () => boolean;
		IsGamepad: () => boolean;
		IsVR: () => boolean;

		AssignSizes: () => AssignSizesObject;
		RichText: () => RichTextObject;
		Keybind: (name: string) => KeybindObject;

		Disconnect(name: string): void;
		Update(name: string, keys: Array<EnumItem>): boolean;
		Began(name: string, keys: Array<EnumItem>, code: () => void): void;
		Ended(name: string, keys: Array<EnumItem>, code: () => void): void;
		Tapped(name: string, code: () => void): void;
	}

	interface Roblox {
		PromptFriendRequest(toPlayer: Player): unknown | boolean;
		PromptUnfriendRequest(toPlayer: Player): unknown | boolean;
		PromptBlockRequest(toPlayer: Player): unknown | boolean;
		PromptUnblockRequest(toPlayer: Player): unknown | boolean;
		PromptGameInvite(player: Player): unknown | boolean;

		GetFriends(player: Player): unknown | boolean;
		GetBlocked(): unknown | boolean;
		GetRankInGroup(player: Player, group: number): unknown | boolean;
		GetFriendsOnline(player: Player, num: number | void): unknown | boolean;
		GetUserHeadshot(userId: number, enumSize: EnumItem | void): unknown | boolean;
		GetUserBust(userId: number, enumSize: EnumItem | void): unknown | boolean;
		GetUserAvatar(userId: number, enumSize: EnumItem | void): unknown | boolean;
		GetUserTeleportInfo(userId: number): unknown | boolean;

		IsFriendsWith(player: Player, userId: number): boolean;
		IsBlockedWith(player: Player, userId: number): boolean;
		IsGameCreator(player: Player): boolean;

		CanSendGameInviteAsync(player: Player): boolean;

		FilterText(text: string, userId: number, context: EnumItem | void): unknown | boolean;
		FilterChatForUser(filter: Instance, toUserId: number): unknown | boolean;
		FilterStringForUser(filter: Instance, toUserId: number): unknown | boolean;
		FilterStringForBroadcast(filter: Instance): unknown | boolean;

		PostNotification(properties: Array<unknown>): unknown | boolean;
		PostNotification(assets: Array<Instance>, code: () => void | void): unknown | boolean;
	}

	function require(this: void, module: "Interface"): Interface;
	function require(this: void, module: "DataSync"): DataSync;
	function require(this: void, module: "Manager"): Manager;
	function require(this: void, module: "Network"): Network;
	function require(this: void, module: "Roblox"): Roblox;

	const createEnum: (name: string, members: string[]) => string[];
}
