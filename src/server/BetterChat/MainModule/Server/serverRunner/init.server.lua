--[[
	This script initializes the server-side of the whole chat system. This will setup channels, commands, and primary events.
]]

--------------- Dependencies: ---------------

local modules = script.Parent:WaitForChild("modules");
local configuration = shared.better_chat.configuration;
local sharedFolder = shared.better_chat.sharedFolder;
local apiModule = script.Parent:WaitForChild("pluginHandler"):WaitForChild("handler"):WaitForChild("API");

--------------- Services: ---------------

local players = game:GetService("Players");
local replicatedStorage = game:GetService("ReplicatedStorage");
local textService = game:GetService("TextService");

--------------- Variables: ---------------

local rateLimits = {};
local typingRateLimits = {};
local speakers = {};
local keys = {};
local rateLimitSettings = {
	configuration.ChatSettings.Server.MessageRateLimit.MaximumAllowedInPeriod,
	configuration.ChatSettings.Server.MessageRateLimit.SpecifiedPeriod,
	configuration.ChatSettings.Server.MessageRateLimit.Cooldown
};

local clientCommands = {
	"/console","/emote ","/e ","/mute ","/unmute ","/ignore ","/unignore ","/?","/help"
};

shared.better_chat.functions = {
	processFunctions = {};
};

--------------- Modules: ---------------

local speaker = require(modules:WaitForChild("chatSystem"):WaitForChild("speaker"));
local chatSystem = require(modules:WaitForChild("chatSystem"));
local utility = require(modules:WaitForChild("utility"));
local channel = shared.better_chat.channel;
local network = shared.better_chat.network;
local permissions = require(modules:WaitForChild("internal"):WaitForChild("permissions"));

--------------- Chat Channels: ---------------

channel.new("all");

--------------- Functions: ---------------

local hasClientCommands = function(message)
	for _,command in pairs(clientCommands) do
		if(message:sub(1,string.len(command)):lower() == command:lower()) then
			return true;
		end
	end
	return false;
end

local fixWhitespace = function(message)
	local disallowedWhitespace = {"\n","\r","\t","\v","\f"};
	for _,character in pairs(disallowedWhitespace) do
		if(character == "\t") then
			message = message:gsub(character,string.char(32));
		else
			message = message:gsub(character,"");
		end
	end
	message = message:gsub("\n","");
	message = message:gsub("[ ]+"," ");
	return message;
end

local setupPlayer = function(player)
	script:WaitForChild("clientInstaller"):Clone().Parent = player.PlayerGui;
	local speaker = speaker:addSpeaker(player.Name,true);
	speaker:addToChannel("all");
	speakers[player.UserId] = speaker;
	rateLimits[player.UserId] = utility:createRateLimited(player.UserId,unpack(rateLimitSettings));
	
	pcall(function()
		speaker.onMessage:Connect(function(...)
			apiModule:WaitForChild("events"):WaitForChild("chattedEvent"):Fire(player,...);
		end)
	end)
	
	local options = chatSystem:getOptions(player,false);
	
	local playerAttributes = {
		{TextColor = options.textColor or Color3.fromRGB(255,255,255)},
		{NameColor = options.nameColor or chatSystem:getNameColor(player,false)},
		{DisplayNameColor = options.displayNameColor or chatSystem:getNameColor(player,true)},
		{ChatBubbleColor = configuration.ChatSettings.Client.BubbleChat.Settings.BubbleBackgroundColor},
		{ChatBubbleTextColor = configuration.ChatSettings.Client.BubbleChat.Settings.BubbleTextColor},
		{TypingIndicatorColor = configuration.ChatSettings.Client.BubbleChat.Settings.TypingIndicatorColor or Color3.fromRGB(255,255,255)},
		{Muted = false}
	}

	for i = 1,#playerAttributes do
		for k,v in pairs(playerAttributes[i]) do
			player:SetAttribute(k,v);
		end
	end
	
	chatSystem.cache[player] = permissions(player);
end

local removePlayer = function(player)
	speaker:removeSpeaker(player.Name);
end

local shallowCopy = function(original)
	local copy = {};
	for key,value in pairs(original) do
		copy[key] = value;
	end
	return copy;
end

local cleanseLine = function(msg,maxLength)
	if(#msg > maxLength*6) then
		return false;
	end

	if(utf8.len(msg) == nil) then
		return false;
	end

	if(utf8.len(utf8.nfcnormalize(msg)) > maxLength) then
		return false;
	end

	return true;
end

local getTeamChannel = function(team)
	local channelName = keys[team] or team.Name.."-"..game:GetService("HttpService"):GenerateGUID();
	local textChannel = channel.cache(channelName);
	keys[channelName] = team;

	for _,player in pairs(team:GetPlayers()) do
		textChannel:addSpeaker(speakers[player.UserId]);
	end

	return textChannel;
end

local getAllowedSpeakersInChannel = function(channel,player)
	local list = {};
	for _,speaker in pairs(channel:getSpeakers()) do
		if(game:GetService("Chat"):CanUsersChatAsync(player.UserId,speaker.UserId)) then
			table.insert(list,speaker);
		end
	end
	return list;
end

--------------- Events: ---------------

network:createRemoteEvent("typingIndicator",function(player,bool)
	if(configuration.ChatSettings.Client.BubbleChat.Enabled) then
		if(bool ~= nil and type(bool) == "boolean") then
			if(typingRateLimits[player.UserId] == nil) then
				typingRateLimits[player.UserId] = utility:createRateLimited(player.UserId,5,1,2);
			end
			local rateLimit = typingRateLimits[player.UserId];
			if(not rateLimit:isLimited()) then
				rateLimit:addEntry();
				network:fireAllClients("typingIndicator",player,bool)
			end
		end
	end
end)

network:createRemoteEvent("onMessageCreated");
network:createRemoteEvent("onMessageFiltered");
network:createRemoteEvent("handleClientCommand");
network:createRemoteFunction("requestConfig",function()
	return shared.better_chat.configuration;
end)

network:createRemoteFunction("requestHistory",function(player,channelName)
	local speaker = speakers[player.UserId];
	if(speaker:isInChannel(channelName)) then
		if(channel:getChannel(channelName) ~= nil) then
			return channel:getChannel(channelName):getHistoryForUser(player.UserId);
		end
	end
end)

network:createRemoteFunction("getPermissions",function(player,target)
	return permissions(target);
end)

network:createRemoteFunction("isSpeaker",function(player,speakerName)
	return speaker:getSpeaker(speakerName) and true or nil;
end)

network:createRemoteFunction("requestMessage",function(player,message,channelName,whisperData,isTeamMessage)
	if(string.len(message) < 1) then
		return false,"You cannot send an empty message.";
	elseif(player:GetAttribute("Muted") == false) then
		if(game:GetService("Chat"):CanUserChatAsync(player.UserId)) then
			channelName = channelName or "all";
			local rateLimit = rateLimits[player.UserId];
			if(not rateLimit:isLimited() and string.len(message) >= 1) then
				rateLimit:addEntry();
				message = fixWhitespace(message);
				if(not cleanseLine(message,configuration.ChatSettings.Client.MaximumMessageLength)) then
					return false,"Message is too long.";
				end
				local success,result = chatSystem:createMessageObject(player.Name,message,channelName,player,"default");
				if(success) then
					if(not hasClientCommands(message)) then
						if(whisperData.user ~= nil and whisperData.user:IsA("Player") and configuration.ChatSettings.Server.WhisperEnabled) then -- WHISPER MESSAGE
							if(game:GetService("Chat"):CanUsersChatAsync(player.UserId,whisperData.user.UserId)) then
								if(whisperData.user ~= player) then
									local key = whisperData.user.UserId * player.UserId;
									local channelName = string.format("%f",key):split(".")[1].."-whisper";							
									local chatChannel = channel.cache(channelName);
									result.channel = channelName;
									result.messageType = "whisper";
									result.toSpeaker = whisperData.user.Name;
									
									for _,speakerName in pairs({whisperData.user.Name,player.Name}) do
										speaker:getSpeaker(speakerName):addToChannel(channelName);
									end
									
									network:fireClients("onMessageCreated",getAllowedSpeakersInChannel(chatChannel,player),result);

									coroutine.wrap(function()
										result.filter();
										chatChannel:addMessage(shallowCopy(result));
										for _,speaker in pairs(getAllowedSpeakersInChannel(chatChannel,player)) do
											if(speaker.UserId ~= nil) then
												result.message = ((type(result.filterResult) == "string") and result.filterResult) or (result.filterResult:GetChatForUserAsync(speaker.UserId));
												network:fireClient("onMessageFiltered",speaker,result);
											end
										end
									end)();
								else
									return false,"You cannot whisper to yourself.";
								end
							else
								return false,"You cannot whisper to this user.";
							end
						elseif(not isTeamMessage) then -- REGULAR MESSAGE (END WHISPER MESSAGE)
							local chatChannel = channel:getChannel(channelName);
							network:fireClients("onMessageCreated",getAllowedSpeakersInChannel(chatChannel,player),result);
							coroutine.wrap(function()
								result.filter();
								chatChannel:addMessage(shallowCopy(result));
								for _,speaker in pairs(getAllowedSpeakersInChannel(chatChannel,player)) do
									if(speaker.UserId ~= nil) then
										result.message = ((type(result.filterResult) == "string") and result.filterResult) or (result.filterResult:GetChatForUserAsync(speaker.UserId));
										network:fireClient("onMessageFiltered",speaker,result);
									end
								end
							end)();
						elseif(isTeamMessage) then -- TEAM MESSAGE (END REGULAR MESSAGE)
							if(player.Team ~= nil) then
								result.isTeamMessage = true;
								local chatChannel = getTeamChannel(player.Team);
								network:fireClients("onMessageCreated",getAllowedSpeakersInChannel(chatChannel,player),result);
								chatChannel:addMessage(result);
								coroutine.wrap(function()
									result.filter();
									for _,speaker in pairs(getAllowedSpeakersInChannel(chatChannel,player)) do
										if(speaker.UserId ~= nil) then
											result.message = ((type(result.filterResult) == "string") and result.filterResult) or (result.filterResult:GetChatForUserAsync(speaker.UserId));
											network:fireClient("onMessageFiltered",speaker,result);
										end
									end
								end)();
							else
								return false,"You are not in a valid team.";
							end
						end -- END TEAM MESSAGE
					else
						network:fireClient("handleClientCommand",player,message);
					end
					return true,"Successfully posted message.";
				else
					if(not result) then
						return false,false;
					else
						return false,result;
					end
				end
			else
				return false,string.format("Slow down! Please wait %s more seconds.",rateLimit:getLimit());
			end
		else
			return false,"Your account is not allowed to send messages.";
		end
	else
		return false,"You are currently muted.";
	end
end)

--------------- Speaker setup: ---------------

for _,player in pairs(players:GetPlayers()) do
	coroutine.wrap(function()
		setupPlayer(player);
	end)();
end

players.PlayerAdded:Connect(setupPlayer);
players.PlayerRemoving:Connect(removePlayer);