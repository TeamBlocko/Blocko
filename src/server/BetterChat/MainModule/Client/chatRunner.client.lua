--[[
	This script will setup the chat system for the client.
]]

--------------- Variables: ---------------

local modules = script.Parent:WaitForChild("modules");
shared.better_chat = {};

--------------- Modules: ---------------

local setupUI = script.Parent:WaitForChild("initializeUI");
local setupFramework = script.Parent:WaitForChild("setupChat");
local bubbleChat = modules:WaitForChild("bubbleChat");
local network = require(game:GetService("ReplicatedStorage"):WaitForChild("BetterChatShared"):WaitForChild("network"));
local richText = require(game:GetService("ReplicatedStorage"):WaitForChild("BetterChatShared"):WaitForChild("richText"));
local detectPlatform = require(modules:WaitForChild("detectPlatform"));
local initializePlugins = require(modules:WaitForChild("pluginManager"):WaitForChild("initialize"));
local initializeWhisper = require(modules:WaitForChild("ui"):WaitForChild("whisperChat"));
local initializeTeam = require(modules:WaitForChild("ui"):WaitForChild("teamChat"));
local mouse = require(modules:WaitForChild("mouseEvents"));

if(detectPlatform() ~= "Console") then
	--------------- Extra Variables: ---------------

	local configuration = network:invokeServer("requestConfig");
	local chatSettings = configuration.ChatSettings.Client;
	local chatSettingServer = configuration.ChatSettings.Server;
	
	if(game:GetService("Chat"):CanUserChatAsync(game:GetService("Players").LocalPlayer.UserId)) then		
		--------------- Setup chat: ---------------

		local chatUI = require(setupUI)(detectPlatform,chatSettings,mouse); --> This line chain sets up the chat's UI functionality.
		local setupDetails = require(setupFramework)( --> This line chain sets up everything else, such as sending messages, recieving messages, and all the other functions.
			chatUI,chatSettings,network,chatSettingServer,richText,
			detectPlatform,mouse,initializeWhisper,initializeTeam,
			configuration
		);
		
		if(chatSettings.BubbleChat.Enabled) then
			require(bubbleChat);
		end
		
		--------------- Setup plugins: ---------------

		local pluginSetup = initializePlugins(network);
		
		--------------- Default message: ---------------

		shared.better_chat.messageCreators.systemMessage("Chat '/?' or '/help' for a list of chat commands.","all");
	else
		local chatUI = require(setupUI)(detectPlatform,chatSettings,mouse);
		local chatbar = chatUI.Container.ChatWindow.Chatbar.Box;
		chatbar.TextEditable = false;
		chatbar.PlaceholderText = "Your chat settings prevent you from accessing the chat."
		chatbar.Focused:Connect(function()
			chatbar:ReleaseFocus();
		end)
	end
end