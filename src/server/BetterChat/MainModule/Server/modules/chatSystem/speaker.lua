--[[
	This module creates "speaker" objects similar to the default chat system. A speaker can send messages
	in accessed channels. Each player added will have their own speaker object assigned automatically. You can
	create your own chat speakers to make hints / announcements.
]]

--------------- Module: ---------------

local speaker = {
	speakers = {},
	network = shared.better_chat.network;
};

--------------- Variables: ---------------

local players = game:GetService("Players");
local textService = game:GetService("TextService");
local chat = game:GetService("Chat");

--------------- Functions: ---------------

function speaker:getSpeakerByIdentifier(id)
	for _,speaker in pairs(speaker.speakers) do
		if(speaker.speakerIdentifier == id) then
			return speaker;
		end
	end
end

function speaker.cache(name,isPlayer)
	if(speaker:getSpeaker(name) == nil) then
		return speaker:addSpeaker(name,isPlayer)
	else
		return speaker:getSpeaker(name);
	end
end

function speaker:addSpeaker(name,isPlayer)
	assert(name ~= nil and type(name) == "string","Invalid \"string\" passed");
	assert(not speaker.speakers[name] ~= nil,string.format("%q is an existing speaker name.",name));
	local channel = shared.better_chat.channel;
	
	local events = {};
	local newSpeaker = {
		speakerUserId = 0,
		name = name,
		inChannels = {},
		speakerIdentifier = game:GetService("HttpService"):GenerateGUID(),
		isPlayer = isPlayer,
		tags = {}
	};
	
	local onMessage = Instance.new("BindableEvent");
	table.insert(events,onMessage);
	
	newSpeaker.onMessage = onMessage.Event;

	if(isPlayer == true and players[name] ~= nil) then
		newSpeaker.speakerUserId = players[name].UserId;
	end
	
	function newSpeaker:getPlayer()
		return isPlayer and players[name] or nil;
	end
	
	function newSpeaker:getEvents()
		return events;
	end
	
	function newSpeaker:addToChannel(name)
		if(channel:getChannel(name) ~= nil) then
			channel:getChannel(name):addSpeaker(newSpeaker);
		else
			warn(string.format("Channel %q does not exist.",name));
		end
	end
	
	function newSpeaker:isInChannel(name)
		return table.find(newSpeaker.inChannels,name) ~= nil;
	end
		
	function newSpeaker:Destroy()
		for _,event in pairs(events) do
			event:Destroy();
		end
		for _,channelName in pairs(newSpeaker.inChannels) do
			if(channel:getChannel(channelName) ~= nil) then
				channel:getChannel(channelName):removeSpeaker(newSpeaker);
			end
		end
		for key,value in pairs(newSpeaker) do
			newSpeaker[key] = nil;
		end
		speaker.speakers[name] = nil;
	end

	speaker.speakers[name] = newSpeaker;

	return newSpeaker;
end

function speaker:removeSpeaker(name)
	assert(name ~= nil and type(name) == "string","Invalid \"string\" passed");
	assert(speaker.speakers[name] ~= nil,string.format("A speaker with the name of %q does not exist.",name));
	speaker.speakers[name]:Destroy();
end

function speaker:getSpeaker(name)
	return speaker.speakers[name];
end

--------------- Declarations: ---------------

shared.better_chat.speaker = speaker;
speaker.channel = require(script.Parent:WaitForChild("channel"));
shared.better_chat.channel = speaker.channel;

--------------- Return: ---------------

return speaker;