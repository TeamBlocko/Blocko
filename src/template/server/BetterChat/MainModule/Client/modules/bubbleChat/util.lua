--[[
	This utility module contains some utility functions as well as the configuration.
]]

--------------- Module: ---------------

local utility = {
	bubbleRemovalTime = 8,
	relativeSize = 320,
};

--------------- Variables: ---------------

local richText = require(game:GetService("ReplicatedStorage"):WaitForChild("BetterChatShared"):WaitForChild("richText"));
local network = require(game:GetService("ReplicatedStorage"):WaitForChild("BetterChatShared"):WaitForChild("network"));
local onFiltered = Instance.new("BindableEvent");
local typingIndicator = Instance.new("BindableEvent");
local configuration = network:invokeServer("requestConfig").ChatSettings.Client.BubbleChat.Settings;

--------------- Configuration: ---------------

utility.padding = configuration.Padding;
utility.textSize = configuration.TextSize;
utility.maxDistance = configuration.MaxDisplayDistance;
utility.maxTextDistance = configuration.MaxTextDisplayDistance;
utility.font = configuration.Font;
utility.backgroundColor = configuration.BubbleBackgroundColor;
utility.textColor = configuration.BubbleTextColor;
utility.typingIndicatorColor = configuration.TypingIndicatorColor or Color3.fromRGB(255,255,255);

--------------- Methods: ---------------

function utility:getBounds(text,textSize,font,width)
	local bounds = game:GetService("TextService"):GetTextSize(text,textSize,font,Vector2.new(width,10000));
	return bounds;
end

--------------- Return: ---------------

return utility;