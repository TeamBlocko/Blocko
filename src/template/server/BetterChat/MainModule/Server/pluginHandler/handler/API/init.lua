--[[
	This module provides an API extension for plugin developers.
]]

repeat
	game:GetService("RunService").Heartbeat:Wait();
until shared.better_chat.speaker and shared.better_chat.channel;

--------------- Variables: ---------------

local events = script:WaitForChild("events");
local chattedEvent = Instance.new("BindableEvent");
chattedEvent.Parent = events;
chattedEvent.Name = "chattedEvent";

--------------- Module: ---------------

local api = {};

--------------- Service wrappers: ---------------

api.httpService = require(script:WaitForChild("httpService"));
api.webhook = require(script:WaitForChild("discordWebhook"));

--------------- Internals: ---------------

api.network = shared.better_chat.network;
api.channel = shared.better_chat.channel;
api.speaker = shared.better_chat.speaker;
api.chatSystem = shared.better_chat.chatSystem;

--------------- Methods: ---------------

function api:playerCallback(callback)
	for _,v in pairs(game:GetService("Players"):GetPlayers()) do
		callback(v);
	end
	game:GetService("Players").PlayerAdded:Connect(function(player)
		callback(player);
	end)
end

function api:registerMessageProcessFunction(callback)
	if(callback and type(callback) == "function") then
		table.insert(shared.better_chat.functions.processFunctions,callback);
	else
		warn("[BETTER CHAT]: Expected type \"function\" for :registerMessageProcessFunction");
	end
end

--------------- Events: ---------------

api.Chatted = chattedEvent.Event;

--------------- Return: ---------------

return api;