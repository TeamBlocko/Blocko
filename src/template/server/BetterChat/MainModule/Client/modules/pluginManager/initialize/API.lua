--[[
	This module is used as the client-sided API system for the plugin addons.
]]

--------------- Module: ---------------

local API = {};

--------------- Variables: ---------------

local friendJoinedEvent = Instance.new("BindableEvent");
local userPlatform = require(script.Parent.Parent.Parent:WaitForChild("detectPlatform"));

--------------- API events: ---------------

API.friendJoined = friendJoinedEvent.Event;
API.playerBlocked = game:GetService("StarterGui"):GetCore("PlayerBlockedEvent").Event;
API.playerUnblocked = game:GetService("StarterGui"):GetCore("PlayerUnblockedEvent").Event;
API.playerFriended = game:GetService("StarterGui"):GetCore("PlayerFriendedEvent").Event;
API.playerUnfriended = game:GetService("StarterGui"):GetCore("PlayerUnfriendedEvent").Event;

--------------- API functions: ---------------

function API.newBubbleChat(...)
	return shared.better_chat.bubbleChatAPI.newSpeaker(...);
end

function API:getBlockedUsers()
	return game:GetService("StarterGui"):GetCore("GetBlockedUserIds");
end

function API.systemMessage(message,channel)
	shared.better_chat.messageCreators.systemMessage(message,channel);
end

function API.finishSetup(network)
	API.network = network;
	API.finishSetup = nil;
end

function API:getPermissions(user)
	return API.network:invokeServer("getPermissions",user);
end

--------------- API variables: ---------------

API.userPlatform = userPlatform();

--------------- Player events: ---------------

game:GetService("Players").PlayerAdded:Connect(function(player)
	pcall(function()
		if(game:GetService("Players").LocalPlayer:IsFriendsWith(player.UserId)) then
			friendJoinedEvent:Fire(player);
		end
	end)
end)

--------------- Return: ---------------

return API;