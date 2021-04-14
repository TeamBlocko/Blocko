--[[
	Here's the channel system, it'll create a channel that you can assign users to and post messages to.
]]

--------------- Module: ---------------

local channel = {
	channels = {},
	speaker = shared.better_chat.speaker,
	network = shared.better_chat.network,
	messageStorageLimit = shared.better_chat.configuration.ChatSettings.Server.MessageHistoryLength
};

--------------- Functions: ---------------

local shallowCopy = function(original)
	local copy = {};
	for key,value in pairs(original) do
		copy[key] = value;
	end
	return copy;
end

--------------- Methods: ---------------

function channel.cache(name)
	if(channel:getChannel(name) == nil) then
		return channel.new(name);
	else
		return channel:getChannel(name);
	end
end

function channel:getChannel(name)
	return channel.channels[name];
end

function channel.new(name)
	assert(channel.channels[name] == nil,string.format("Channel %q already exists.",name));
	local chatChannel = {
		name = name
	};
	
	local internal = {
		speakers = {},
		messages = {},
	}
	
	function chatChannel:getHistory()
		local history = {};
		for i = #internal.messages,1,-1 do
			table.insert(history,internal.messages[i]);
		end
		return history;
	end
	
	function chatChannel:getHistoryForUser(id)
		local messageHistory = {};
		local target = game:GetService("Players"):GetPlayerByUserId(id);

		for i = #internal.messages,1,-1 do
			local addToHistory = true;
			if(internal.messages[i].fromSpeakerId ~= nil) then
				if(game:GetService("Players"):GetPlayerByUserId(internal.messages[i].fromSpeakerId) == nil) then
					addToHistory = false;
				else
					if(not game:GetService("Chat"):CanUsersChatAsync(internal.messages[i].fromSpeakerId,id)) then
						addToHistory = false;
					else
						local target = game:GetService("Players"):GetPlayerByUserId(internal.messages[i].fromSpeakerId);
						if(target) then
							internal.messages[i].player = target;
						end
					end
				end
			end
			if(addToHistory) then
				table.insert(messageHistory,internal.messages[i]);
			end
		end
		
		if(target ~= nil) then
			for i = 1,#messageHistory do
				messageHistory[i] = shallowCopy(messageHistory[i]);
				local result = messageHistory[i];
				if(result.isFiltered == false and result.unfilteredMessage) then
					result.message = result.unfilteredMessage;
					result.isFiltered = true;
				else
					result.message = ((type(result.filterResult) == "string") and result.filterResult) or (result.filterResult:GetChatForUserAsync(id));
				end
			end
		else
			return {};
		end
		
		return messageHistory;
	end
	
	local getAllowed = function(channel,message)
		local list = {};
		for _,speaker in pairs(chatChannel:getSpeakers()) do
			if(message.isPlayer) then
				if(game:GetService("Chat"):CanUsersChatAsync(message.player.UserId,speaker.UserId)) then
					table.insert(list,speaker);
				end
			else
				table.insert(list,speaker);
			end
		end
		return list;
	end
	
	function chatChannel:addMessage(result,replicate)
		table.insert(internal.messages,1,result);
		for i = 1,#internal.messages do
			if(i > channel.messageStorageLimit) then
				table.remove(internal.messages,i);
			end
		end
		result = shallowCopy(result);
		if(replicate) then
			coroutine.wrap(function()
				result.initialize = nil;
				result.filterResult = shared.better_chat.chatSystem:filter(channel.speaker:getSpeaker(result.fromSpeaker):getPlayer(),result.unfilteredMessage);
				result.isFiltered = true;
				result.unfilteredMessage = nil;
				for _,speaker in pairs(getAllowed(chatChannel,result)) do
					if(speaker.UserId ~= nil) then
						result.message = ((type(result.filterResult) == "string") and result.filterResult) or (result.filterResult:GetChatForUserAsync(speaker.UserId));
						channel.network:fireClient("onMessageFiltered",speaker,result);
					end
				end
				result = {};
			end)();
		end
	end
	
	function chatChannel:isSpeakerInChannel(speaker)
		if(speaker.name ~= nil and speaker.speakerIdentifier ~= nil) then
			return internal.speakers[speaker.speakerIdentifier] ~= nil;
		else
			return false;
		end
	end
	
	function chatChannel:getSpeakers()
		local tbl = {};
		for speakerId,inChannel in pairs(internal.speakers) do
			local speaker = channel.speaker:getSpeakerByIdentifier(speakerId);
			if(speaker ~= nil and speaker:getPlayer() ~= nil) then
				table.insert(tbl,speaker:getPlayer());
			end
		end
		return tbl;
	end
	
	function chatChannel:addSpeaker(speaker)
		if(table.find(speaker.inChannels,name) == nil) then
			internal.speakers[speaker.speakerIdentifier] = true;
			table.insert(speaker.inChannels,name);
		else
			-- warn(string.format("Speaker %q is already in channel %q.",speaker.name,name));
		end
	end
	
	function chatChannel:removeSpeaker(speaker)
		if(table.find(speaker.inChannels,name) ~= nil) then
			internal.speakers[speaker.speakerIdentifier] = nil;
			table.remove(speaker.inChannels,table.find(speaker.inChannels,name));
		else
			warn(string.format("Speaker %q is not in channel %q.",speaker.name,name));
		end
	end
	
	channel.channels[name] = chatChannel;
	return chatChannel;
end

--------------- Return: ---------------

return channel;