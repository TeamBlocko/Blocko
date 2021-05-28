--[[
	  ____       _   _               _____ _           _
	 |  _ \     | | | |             / ____| |         | |
	 | |_) | ___| |_| |_ ___ _ __  | |    | |__   __ _| |_
	 |  _ < / _ \ __| __/ _ \ '__| | |    | '_ \ / _` | __|
	 | |_) |  __/ |_| ||  __/ |    | |____| | | | (_| | |_
	 |____/ \___|\__|\__\___|_|     \_____|_| |_|\__,_|\__|

	By: likeajumpingpro
	Version: [BETA] 1.0.4
	Description: Better-Chat began as a chat fork to expand the default chat's functionality, but it quickly evolved into a fully-blown custom chat system.
	Support: Toxic#2799 or our server: Er3BQUk8Vb

]]

return {
	--[[
		------ Permissions: ------
			This is the permission system, it does not provide administrator powers. The permissions system allows you to
			easily set groups of people's chat tags,chat color,and more! This can be used to highlight your game admins,
			roblox premium users,gamepass owners,or unique users.

			Rank format: {(RANK NUMBER = INT),(RANK NAME = STRING)}
			Rank example: {1,"Example Rank"}

			- The highest numbered rank is automatically assigned to the game's creator.
	]]

	Permissions = {
		Ranks = {
			--[[
			{3,"Owner"}, --> The highest rank number, which is this one is automatically assigned to the game's creator.
			{2,"Admin"},
			{1,"VIP"},
			{0,"NonAdmin"}
			]]
		},

		Users = {
			--[[
			-- Format: "[NAME/USERID] = RANK",
			["ROBLOX"] = "Admin",
			[156] = "Admin"
			]]
		},

		Gamepasses = {
			[0] = "VIP" --> This gives anyone who owns the gamepass "0" the specified rank.
		},

		Groups = {
			--[[
			[0] = { --> This is set up anyone in the group with the group ID "0" with the rank of "254" will recieve the "Admin" permission for the chat system.
				[254] = "Admin"
			};
			]]
		},

		RobloxPremium = "NonAdmin", --> You can give Roblox premium users special chat perks with this configuration.
	},

	--[[
		------ Chat Tags: ------
			This system will allow you to assign specific users or groups of users tags. This
			utilizes the permissions system. You can add users separated by commas if you don't
			want to have individual ranks.
	--]]

	ChatTags = {
		--[[
			------ Format: ------
			{
				Name = "",
				Color = Color3.fromRGB(0,0,0),
				PermissionRank = 0,
				Users = {}
			},
		]]
		--[[
		{
			-- This is an example chat tag, it'll give the game creator a yellow chat tag that says "Owner".

			Text = "Owner", --> The given chat tag text.
			Color = Color3.fromRGB(255,255,0), --> The given chat color.
			Icon = "rbxassetid://519213189",
			PermissionRank = 3 --> The rank required to have an owner tag. This is default to the owner permission set above.
		}
		]]
	},

	--[[
		------ Chat Color: ------
			This system will allow you to assign specific users or groups of users chat colors. This
			utilizes the permissions system similar to the chat tags above.

			- Adding "nil" for a value will ignore it when the user sends a message and use the default option.
	--]]

	ChatColors = {
		--[[
			------ Format: ------
			{
				NameColor = Color3.fromRGB(0,0,0),
				DisplayNameColor = Color3.fromRGB(0,0,0),
				ChatColor = Color3.fromRGB(0,0,0),
				PermissionRank = 0,
				Users = {}
			},
		]]
		--[[
		{
			NameColor = nil, --> This would be the name color given, but setting it to "nil" makes it default to the regular name color.
			DisplayNameColor = nil, --> If you have display names enabled, this will be their display name's color. Setting it to "nil" will default it to their regular display name color.
			ChatColor = Color3.fromRGB(255,255,0), --> This is the chat color given for anyone with permissions.
			PermissionRank = 3, --> You can set up a rank above and assign people chat colors using this method.
			Users = {} --> If you don't want to set up an entire rank, you can just add user ids or usernames separated by a comma.
		}
		]]
	},

	--[[
		------ Security settings: ------
			These settings can further secure the chat system from exploits. I'm planning on adding more, but
			there's not much more to really add to it.
	--]]

	Security = {
		ChattedEvent = { --> Player.Chatted event
			HidePrivateMessages = true --> Messages in team chat or whisper chat will be hidden from the .Chatted event. Our API provides a custom event that prevents this restriction.
		}
	},

	--[[
		------ Chat settings: ------
			Below are the primary chat settings for your users.
	--]]

	ChatSettings = {
		Server = {
			------ Cooldown system: ------

			MessageRateLimit = { 
				-- Message rate limiting prevents mass-spam in your chat. You can configure it below:
				MaximumAllowedInPeriod = 6, --> Maximum allowed messages in the specified period
				SpecifiedPeriod = 8, --> This is the specified period in which you can send "X" amount of messages before being stopped by the system.
				Cooldown = 8, --> Once they pass the maximum messages allowed in the specified period, they won't be able to send messages for however long you set this variable to.
			},

			------ General configuration: ------

			WhisperEnabled = true, --> This determines whether or not you can whisper to other users in the chat.
			MessageHistoryLength = 100, --> This is how many messages can be stored in a channel at once before being deleted.
		},

		Client = {
			------ Fade in + fade out system configuration: ------

			FadeSettings = {
				FadedOutChatWindowTransparency = 1, --> The transparency the chat window goes to when it fades out
				FadedInChatWindowTransparency = 0.75, --> The transparency the chat window goes to when it fades in
				ChatbarFadeInPlaceholderColor = Color3.fromRGB(100,100,100), --> The placeholder text color of the chatbar when it fades in
				ChatbarFadeOutPlaceholderColor = Color3.fromRGB(255,255,255), --> The placeholder text color of the chatbar when it fades out
				FadeOutChatbarTransparency = 1, --> The transparency the chatbar goes to when it fades out
				FadeInChatbarTransparency = 0, --> The transparency the chatbar goes to when it fades in
			},

			------ Autofill system: ------

			AutofillTextbox = true, --> Show a light text autofill when the autofill menu is out, disabling that will disable this in turn.
			AutofillMenu = true, --> A popout menu to display player names for commands, and the emoji autofill list.
			AutoReplaceEmoji = true, --> Automatically replace things like ":flushed:" with the corresponding emoji.

			------ Text size + UI roundness: ------

			MinimumTextSize = 9, --> Minimum chat text size.
			MaximumTextSize = 20, --> Maximum chat text size.
			RoundnessDivider = 1.5, --> The chat's roundness is determined by the text size to stay proportional. This roundness is divided by this number. So for example, setting it to 0 will make the chat squared.

			------ Bubble Chat: ------

			BubbleChat = {
				Enabled = true, --> This will determine if the custom bubble chat system is enabled.
				Settings = {
					MaxTextDisplayDistance = 40, --> This is how many studs away your camera is before the text is replaced with "..."
					MaxDisplayDistance = 100, --> This is how many studs away your camera is before the chat bubbles disappear until zoomed back in range.
					TextSize = 16, --> This is the chat bubble's text size.
					Padding = 8, --> Padding in offset on each side of the message.
					Font = Enum.Font.GothamSemibold, --> The chat bubble's primary font.
					TypingIndicatorColor = Color3.fromRGB(255,255,255), --> Player typing indicator color.
					BubbleBackgroundColor = Color3.fromRGB(20,20,20), --> The chat bubble's background color.
					BubbleTextColor = Color3.fromRGB(255,255,255), --> The chat bubble's text color.
					EasingStyle = Enum.EasingStyle.Bounce, --> The chat bubble's tween style
					Roundness = 0.15, --> The chat bubble's roundness (1 being the absolute max, 0 being the absolute minimum)
					BubbleTweenTime = 0.2 --> The time it takes for tweens to complete (recommended to max at 0.5)
				}
			},

			------ Misc config: ------

			ResizerEnabled = false, --> GUI resizing tool (currently not as stable as I'd like, but this will be fixed in the future).

			------ Chat message configuration: ------

			CanSelectMessages = true, --> This feature allows you to drag to select a message on PC to copy and paste / whatever you want to do with it.
			ChatBarFont = Enum.Font.Gotham, --> The chatbar's font.
			DefaultFont = Enum.Font.GothamSemibold, --> The chat message's font.
			TextStroke = {
				Color = Color3.fromRGB(0,0,0), --> This color is bordered lightly around every message in the chat.
				Transparency = 0.9 --> You can determine the transparency of the color above with this configuration.
			},

			MaximumMessageLength = 200, --> The maximum allowed message length, changing this can result in issues.
			DisplayNames = {
				PlayerDisplayNamesEnabled = true, --> Uses the .DisplayName property instead of usernames in chat messages.
				ItalicizeDisplayName = false, --> If the display name setting is enabled, the player's nametag will be in italics. This can be used to show that their name isn't real.
				HoverToRevealName = true, --> If the display name setting is enabled, hovering over the name in chat will reveal their actual username.
				AutofillByDisplayName = true --> This will make whisper and mentions support display names
			}
		}
	}
};
