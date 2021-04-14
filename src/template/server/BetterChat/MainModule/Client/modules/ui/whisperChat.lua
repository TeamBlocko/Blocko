--[[
	This module handles the whisper chat system. I'm probably gonna rewrite it soon, as of now it's very inefficient.
]]

--------------- Variables: ---------------

local lastData = {};
local localPlayer =  game:GetService("Players").LocalPlayer;
local connections = {};
shared.better_chat.whisperData = lastData;

--------------- Functions: ---------------

local getBounds = function(text, font, textSize, sizeBounds)
	sizeBounds = sizeBounds or Vector2.new(10000,10000);
	return game:GetService("TextService"):GetTextSize(text,textSize,font,sizeBounds);
end

--------------- Module: ---------------

whisper = function(chat,user)
	if(user ~= localPlayer and shared.better_chat.serverConfig.WhisperEnabled and not localPlayer:GetAttribute("Muted")) then
		if(user:GetFullName() ~= user.Name) then
			pcall(function()
				shared.better_chat.endTeamChat();
			end)
			pcall(function()
				shared.better_chat.endWhisper();
			end)
			
			--------------- Variables: ---------------

			local chatbar = chat.Container.ChatWindow.Chatbar.Box;
			local cover = chatbar.ChatbarCover;
			local format = string.format(" To %s ",(shared.better_chat.clientConfig.DisplayNames.PlayerDisplayNamesEnabled and user.DisplayName or user.Name));

			--------------- Setup: ---------------
			
			cover.Text = "";
			cover.ChatbarCoverText.Visible = true;
			cover.ChatbarCoverText.Text = format;
			for _,v in pairs(connections) do
				v:Disconnect();
			end
			connections = {};
			
			--------------- Functions: ---------------
			
			local calculateBounds = function(text)
				return getBounds(text,chatbar.Font,chatbar.TextSize);
			end
			
			local scale = function()
				chatbar.Size = UDim2.new(0.95,0,1,0);
				cover.TextSize = chatbar.TextSize;

				local x = calculateBounds(format).X + (chatbar.TextSize/2);
				local f = workspace.CurrentCamera.ViewportSize.X * (0.0025627883136853);
				local f2 = workspace.CurrentCamera.ViewportSize.X * (0.0030753459764223);
				cover.Size = UDim2.new(0,x,0,chatbar.TextSize * 1.5);
				cover.Visible = true;

				chatbar.AnchorPoint = Vector2.new(0,0.5);
				chatbar.Position = UDim2.new(0,x + (f*2),0.5,0);
				chatbar.Size = UDim2.new(0,chatbar.AbsoluteSize.X - (x + (f*2)),1,0);
				cover.Position = UDim2.new(0,-(x) - (f),0,f2);
			end

			--------------- Initialize: ---------------

			chatbar:CaptureFocus();
			lastData = {};
			lastData.format = format;
			lastData.user = user;
			shared.better_chat.whisperData = lastData;

			shared.better_chat.endWhisper = function()
				chatbar.Size = UDim2.new(0.95,0,1,0);
				chatbar.Position = UDim2.new(0.5,0,0.5,0);
				chatbar.AnchorPoint = Vector2.new(0.5,0.5);
				cover.Visible = false;
				shared.better_chat.endWhisper = nil;
				cover.ChatbarCoverText.Text = "";
				lastData = {};
				lastData.user = nil;
				shared.better_chat.whisperData = lastData;
				for _,v in pairs(connections) do
					v:Disconnect();
				end
				connections = {};
			end
			
			scale();
			
			local connection = workspace.CurrentCamera:GetPropertyChangedSignal("ViewportSize"):Connect(function()
				wait();			
				scale();
			end)
			
			local connection2 = cover.MouseButton1Click:Connect(function()
				shared.better_chat.endWhisper();
			end)
			
			table.insert(connections,connection);
			table.insert(connections,connection2);
		end
	end
end

return whisper;