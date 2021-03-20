--[[
	This module will handle the primary stuff of the chatbar such as:
	- Max message length
	- Emoji autofill
	- Username autofill
	- Whispering
]]

return function(chat,configuration,network,serverConfig,richText,detectPlatform,mouse,initializeWhisper,initializeTeam)
	--------------- Variables: ---------------

	local maxMessageLenth = configuration.MaximumMessageLength;
	local postMessage = require(script:WaitForChild("postMessage"));
	local autofill = require(script:WaitForChild("autofill"))(chat,mouse,configuration);
	local search = require(script:WaitForChild("search"));
	local emojiList = require(game:GetService("ReplicatedStorage"):WaitForChild("BetterChatShared"):WaitForChild("emojis"));
	local chatbar = chat.Container.ChatWindow.Chatbar;
	local textbox = chatbar.Box;
	local last = "";
	local symbol = ":";
	local original = textbox.PlaceholderText;
	local og = original;
	local localPlayer = game:GetService("Players").LocalPlayer;
	local lastInput = 0;
	local status = false;
	local inactive = false;
	
	--------------- Functions: ---------------
	
	local getOriginal = function()
		return og;
	end

	local modifyOriginal = function(text)
		original = text;
	end

	local isMatch = function(text,key)
		key = key or 0;
		local lookFor = {
			{"/w ",true},
			{"/whisper ",true},
			{"/ignore ",true},
			{"/mute ",true},
			{"/unignore ",true},
			{"/unmute ",true},
			{"@",false}
		}
		
		for _,v in pairs(lookFor) do
			if(v[2]) then
				if(text:sub(1,#v[1]) == v[1]) then
					return true,true;
				end
			elseif(text:sub(key,key) == v[1]) then
				return true,false;
			end
		end
		return false,false;
	end
	
	--------------- Connections: ---------------

	textbox:GetPropertyChangedSignal("Text"):Connect(function()
		lastInput = tick();
		shared.better_chat.autofillData = nil;
		if(utf8.len(utf8.nfcnormalize(textbox.Text)) > maxMessageLenth) then
			textbox.Text = last;
			return;
		end
		last = textbox.Text;
		local emojis,closed = search(last,symbol);
		if(#emojis >= 1) then
			if(configuration.AutoReplaceEmoji) then
				if(closed[#closed] == false) then
					local query = (emojis[#emojis]);
					local list = {};
					for name,value in pairs(emojiList) do
						if(name:sub(1,string.len(query)):lower() == query:lower()) then
							table.insert(list,{
								value.." "..symbol..name..symbol,
								name,
								value
							});
						end
					end
					autofill.fill(list,last:sub(1,#last-#query),symbol);
				else
					autofill.fill({});
				end

				for key,v in pairs(emojis) do
					if(closed[key] == true) then
						for name,value in pairs(emojiList) do
							if(name:lower() == v:lower()) then
								autofill.setLabel("");
								textbox.Text = textbox.Text:gsub(symbol..v..symbol,value);
								break;
							end
						end
					end
				end
			end
		else
			local str = "";
			local isWhisper = textbox.Text:sub(1,3) == "/w " or textbox.Text:sub(1,10) == "/whisper ";
			for i = 1,#textbox.Text do
				local a,b = isMatch(textbox.Text,i);
				local validChars = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
				if(a and not b) then
					str = "";
					for i2 = 1,#textbox.Text - i do
						if(validChars:find(textbox.Text:sub(i+i2,i+i2))) then
							str = str..textbox.Text:sub(i+i2,i+i2);
						else
							str = "";
							break;
						end
					end
				elseif(a and b) then
					str = textbox.Text:split(" ")[2];
					for i = 1,#str do
						if(not validChars:find(str:sub(i,i))) then
							str = str:gsub(str:sub(i,i),"");
						end
					end
				end
			end
			if(str ~= "" and game:GetService("Players"):FindFirstChild(str) == nil) then
				local list = {};
				local displayNamesEnabled = shared.better_chat.clientConfig.DisplayNames.PlayerDisplayNamesEnabled and shared.better_chat.clientConfig.DisplayNames.AutofillByDisplayName;
				for _,player in pairs(game:GetService("Players"):GetPlayers()) do
					if(player.Name:sub(1,string.len(str)) == str and (player ~= localPlayer or player == localPlayer and not isWhisper)) then
						table.insert(list,{
							player.Name,
							player.Name,
							player.Name,
							(isWhisper and nil or "@")
						})
					elseif(displayNamesEnabled and (player.DisplayName:sub(1,string.len(str)) == str and (player ~= localPlayer or player == localPlayer and not isWhisper))) then
							table.insert(list,{
							(player.DisplayName .. " ("..player.Name..")"),
							player.DisplayName,
							player.Name,
							(isWhisper and nil or "@")
						})
					end
				end
				autofill.fill(list,last:sub(1,#last-#str));
			else
				autofill.fill({});
			end
			if(isWhisper) then
				local name = textbox.Text:split(" ")[2];
				if(name) then
					for _,v in pairs(game:GetService("Players"):GetPlayers()) do
						if(v.Name:lower() == name:lower() and v ~= localPlayer) then
							textbox.Text = "";
							initializeWhisper(chat,v);
							break;
						end
					end
				end
			elseif(textbox.Text:sub(1,3) == "/t " or textbox.Text:sub(1,6) == "/team ") then
				local success = initializeTeam(chat);
				if(success) then
					if(textbox.Text:sub(1,3) == "/t ") then
						textbox.Text = textbox.Text:sub(4,#textbox.Text);
					elseif(textbox.Text:sub(1,6) == "/team ") then
						textbox.Text = textbox.Text:sub(7,#textbox.Text);
					end
				end
			end
		end
	end)
	
	local indicatorUp = function()
		status = true;
		network:fireServer("typingIndicator",true);
	end
	
	local indicatorDown = function()
		status = false;
		network:fireServer("typingIndicator",false);
	end
	
	game:GetService("RunService").Heartbeat:Connect(function()
		if(status and (tick() - lastInput) >= 5) then
			indicatorDown();
			inactive = true;
		end
	end)
	
	game:GetService("UserInputService").InputBegan:Connect(function(input,gameProcessed)
		if(input.KeyCode == Enum.KeyCode.Slash and textbox:IsFocused() == false) then
			if(not gameProcessed) then
				game:GetService("RunService").RenderStepped:Wait();
				textbox:CaptureFocus();
			end
		elseif(input.KeyCode == Enum.KeyCode.Backspace) then
			if(textbox.CursorPosition == 1 and #textbox.Text == 0) then
				if(shared.better_chat.endWhisper) then
					shared.better_chat.endWhisper();
				elseif(shared.better_chat.endTeamChat) then
					shared.better_chat.endTeamChat();
				end
			end
		end
		lastInput = tick();
		if(inactive and textbox:IsFocused()) then
			inactive = false;
			indicatorUp();
		end
	end)
	
	textbox.Focused:Connect(function()
		textbox.PlaceholderText = "";
		indicatorUp();
	end)
	
	textbox.FocusLost:Connect(function(enterPressed)
		indicatorDown();
		inactive = false;
		if(enterPressed) then
			if(#textbox.Text >= 1) then
				shared.better_chat.autofillData = nil;
				postMessage(textbox.Text,configuration,network);
				textbox.Text = "";
			end
		end
		if(textbox.Text == "") then
			game:GetService("RunService").RenderStepped:Wait();
			textbox.PlaceholderText = original;
		end
	end)
	
	local signal = nil;
	localPlayer.AttributeChanged:Connect(function(name)
		if(name == "Muted") then
			if(signal) then
				signal:Disconnect();
				signal = nil;
			end
			
			local isMuted = localPlayer:GetAttribute("Muted");
			if(isMuted) then
				local muteMessage = "You are currently muted.";
				textbox.TextEditable = false;
				textbox.Text = "";
				textbox.PlaceholderText = muteMessage;
				modifyOriginal(muteMessage);
				signal = textbox.Focused:Connect(function()
					textbox:ReleaseFocus();
				end)
			else
				modifyOriginal(getOriginal());
				textbox.TextEditable = true;
				textbox.PlaceholderText = getOriginal();
			end
		end
	end)
end