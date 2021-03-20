/// <reference types="compiler-types" />
/// <reference types="@rbxts/types" />

export interface MessageOptions {
	textColor: Color3
	nameColor: string

	displayNameColor: Color3
}

export interface ChatTag {
	Color: Color3
	Text: string
}

export interface Message {
	/**
	 * A Globally Unique Identifier generated via HttpService.GenerateGUID.
	 */
	ID: string

	/**
	 * The speaker's name the message is from.
	 */
	fromSpeaker: string

	fromSpeakerId?: number

	/**
	 * The channel's name the message was sent in.
	 */
	channel: string

	/**
	 * No idea
	 */
	content: unknown

	/**
	 * Weither the message is filtered or not.
	 */
	isFiltered: boolean

	/**
	 * Wether the speaker is a player or not.
	 */
	isPlayer: boolean

	/**
	 * Player the message was sent from if they exist.
	 */
	player?: Player

	messageLength: number

	messageType: "default"

	options: MessageOptions

	chatTags: ChatTag[]

	isTeamMessage: boolean
	unfilteredMessage: string
	filter(): void
}


export interface Channel {
	/**
	 * Return the channel's message history.
	 * Messages can only be added to the channels using the "addMessage" function.
	 */
	getHistory(): string[]

	/**
	 * Return the channel's filtered message history by messages sent by `userId`.
	 */
	getHistoryForUser(userId: number): string[]

	/**
	 * Adds a message to the chat's history.
	 * @param replicateMessage if true, the message will be displayed in all connected user's chats
	 */
	addMessage(message: Message, replicateMessage?: boolean): void

	/**
	 * Returns if the `speaker`` is this channel.
	 */
	isSpeakerInChannel(speaker: Speaker): boolean

	/**
	 * Returns an Array of Players who are in this channel.
	 */
	getSpeakers(): Players[]

	/**
	 * Adds `speaker`` to this channel. 
	 */
	addSpeaker(speaker: Speaker): void

	/**
	 * Removes `speaker`` from this channel.
	 */
	removeSpeaker(speaker: Speaker): void
}

export interface Speaker {
	/**
	 * Returns a player object if the speaker is assigned to one.
	 */
	getPlayer(): Player | undefined

	/**
	 * Adds the speaker to a channel with name `channelName`.
	 */
	addToChannel(channelName: string): void

	/**
	 * Returns if the speaker is in a channel with name `channelName`
	 */
	isInChannel(channelName: string): boolean

	/**
	 * Destroys all the connections of the specified speaker and removes their functions.
	 */
	Destroy(): void
}

export interface ChannelAPI {

	/**
	 * Returns the channel you requested if it exists.
	 * The difference between this and the "cache" function is that `cache` will create the channel if it doesn't exist.
	 */
	getChannel(channelName: string): Channel | undefined

	/**
	 * Create a Channel object that can store messages, keep history, and specify the users you want in it.
	 */
	new (channelName: string): Channel
}

export interface SpeakerAPI {

	cache: (speakerName: string) => Speaker


	/**
	 * Create and return a new speaker object with the specified name.
	 * @param isPlayer used to determine filtering and more player-only methods. This should only be turned on if there's a player with the same name as the speaker.
	 */
	addSpeaker(speakerName: string, isPlayer: boolean): Speaker

	/**
	 * This method will remove the entire speaker from the game. This disconnects all events and disables all functions.
	 */
	removeSpeaker(speakerName: string): void

	/**
	 * This method will return a speaker object with the specified name if they exist.
	 */
	getSpeaker(speakerName: string): Speaker | undefined
}

export interface ChatUtility {
	/**
		Filter `message` to be sent publically. If it fails, it'll set a plain string composed of underscores.
		If there's no player argument sent, it won't filter at all and just return the message.
	 */
	filter(player: Player | undefined, message: string): string

	/**
	 * Create a Message object that is used to send messages in channels.
	 */
	createMessageObject(speakerName: string, message: string, channelName: string, player: Player | undefined, messageType: "default"): LuaTuple<[true, Message] | [false, string]>
}


/**
 * A function on the server
 * @rbxts server
 */
export interface ServerAPI {
	// METHODS

	/**
	 * Registers a function to all current players and any players who join in the future.
	 */
	playerCallback(callback: (player: Player) => void): void

	/**
	 * The callback passed to this function is called before a message is processed.
	 * This will allow you to choose whether or not to hide a specific message.
	 * If set to a blank string such as "", it will not send any message when hidden.
	 */
	registerMessageProcessFunction(callback: (messageObject: Message) => [boolean, string]): void

	// EVENTS

	/**
	 * The regular chatted event has some security vulnerabilities that are by default fixed.
	 * This however can cause certain features to break, such as the event firing in whisper and team channels.
	 * You can toggle that option in the "Security" portion of the configuration.
	 * This is primarily to prevent exploiters from picking up on conversations that are meant to be private.
	 * This event will be fired regardless of the security configuration.
	 */
	Chatted: RBXScriptSignal<(player: Player, messageObject: Message) => void>

	channel: ChannelAPI
	speaker: SpeakerAPI
	chatSystem: ChatUtility
}