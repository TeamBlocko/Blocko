--[[
	This module sets up the bubble chat system by linking all the internal modules together.
]]

--------------- Load: ---------------

if(not game:IsLoaded()) then
	game.Loaded:Wait();
end

--------------- Variables: ---------------

local utility = require(script:WaitForChild("util"));
local richText = require(game:GetService("ReplicatedStorage"):WaitForChild("BetterChatShared"):WaitForChild("richText"));
local network = require(game:GetService("ReplicatedStorage"):WaitForChild("BetterChatShared"):WaitForChild("network"));
local onFiltered = Instance.new("BindableEvent");
local typingIndicator = Instance.new("BindableEvent");
local configuration = network:invokeServer("requestConfig");
shared.better_chat.bubbleChatAPI = require(script:WaitForChild("apiAccess"));

--------------- Functions: ---------------

local mentionTag = function(name)
	return "@" .. name;
end

local getColorTag = function(text,color)
	local tbl = {color.R,color.G,color.B};
	for i = 1,#tbl do
		tbl[i] = tostring(math.floor(tbl[i]*255));
	end
	return '<font color="rgb('..table.concat(tbl,",")..')">'..text..'</font>';
end

local markMentions = function(message)
	local displayNames = configuration.ChatSettings.Client.DisplayNames.PlayerDisplayNamesEnabled;
	for _,player in pairs(game:GetService("Players"):GetPlayers()) do
		local old = message;
		message = message:gsub(mentionTag(player.Name),getColorTag(mentionTag(displayNames and player.DisplayName or player.Name),Color3.fromRGB(255,255,127)));
		if(message == old and displayNames) then
			message = message:gsub(mentionTag(player.DisplayName),getColorTag(mentionTag(displayNames and player.DisplayName or player.Name),Color3.fromRGB(255,255,127)));
		end
	end
	
	return message;
end

local connect = function(functions,player)
	local indicator = functions.chatBubble.typingIndicator();
	indicator.Name = "TypingIndicator";
	
	local down = function()
		functions.stack:pushDown(true,functions.stack:getKey(indicator),false);
		indicator.Visible = false;
	end
	
	local connection;
	connection = onFiltered.Event:Connect(function(messageObject)
		if(messageObject.isPlayer and messageObject.player == player) then
			down();
			local container = functions.ui.Container;
			local sentMessage = richText.markdown_format(messageObject.message);
			local bubble,connection = functions.chatBubble.create(markMentions(sentMessage));
			local conn;
			conn = game:GetService("RunService").Heartbeat:Connect(function()
				if(bubble:GetFullName() == bubble.Name) then
					conn:Disconnect();
					connection:Disconnect();
				end
			end)
		end
	end)
	
	local connection2;
	local wasTyping = false;
	connection2 = typingIndicator.Event:Connect(function(plr,isTyping)
		if(plr == player) then
			if(isTyping) then
				down();
				pcall(function()
					indicator.Caret.ImageTransparency = 0;
				end)
				indicator.Visible = true;
				functions.stack:push(indicator,indicator,true);
			else
				down();
			end
		end
	end)

	return function()
		connection:Disconnect();
	end
end

local bindToPlayer = function(player)
	local load = function(character)
		local billboardGui = require(script:WaitForChild("billboardGui"));
		local functions = billboardGui.create(character:WaitForChild("Head"),player.UserId,player);
		local disconnect = connect(functions,player)
		local connection;
		connection = game:GetService("RunService").Heartbeat:Connect(function()
			if(character:GetFullName() == character.Name) then
				connection:Disconnect();
				disconnect();
				functions.ui:Destroy();
			end
		end)
	end

	player.CharacterAdded:Connect(load);
	if(player.Character) then
		load(player.Character);
	end
end

--------------- Connections: ---------------

for _,player in pairs(game:GetService("Players"):GetPlayers()) do
	coroutine.wrap(function()
		bindToPlayer(player);
	end)();
end
game:GetService("Players").PlayerAdded:Connect(bindToPlayer);

network:bindRemoteEvent("onMessageFiltered",function(...)
	onFiltered:Fire(...);
end)

network:bindRemoteEvent("typingIndicator",function(...)
	typingIndicator:Fire(...);
end)

--------------- Return: ---------------

return true;