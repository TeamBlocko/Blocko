--[[
	This module creates the regular message seen in chat. It contains scaling, mentions, and autoscroll stuff.
]]

return function(chat,messageData,messageUtility,richText,font,initializeWhisper,textStroke,isWhisper,platform)
	shared.better_chat.messageData = {} or shared.better_chat.messageData;
	
	--------------- Variables: ---------------

	local object = {};
	local lastMessage = "";
	local preFormat = "";
	local scroller = chat.Container.ChatWindow.Scroller;
	local insideFrame = false;
	local localPlayer = game:GetService("Players").LocalPlayer;
	local playerMouse = localPlayer:GetMouse();
	local playerGui = localPlayer.PlayerGui;
	local layout = scroller:FindFirstChildOfClass("UIListLayout");
	local displayNamesEnabled = shared.better_chat.clientConfig.DisplayNames.PlayerDisplayNamesEnabled and shared.better_chat.clientConfig.DisplayNames.HoverToRevealName;
	local displayNamesItalics = displayNamesEnabled and shared.better_chat.clientConfig.DisplayNames.ItalicizeDisplayName or false;
	local selectionEnabled = shared.better_chat.clientConfig.CanSelectMessages and platform == "Desktop";
	
	--------------- Modules: ---------------
	
	local ui,functions = require(script:WaitForChild("UI"))(font,textStroke,selectionEnabled);
	local mouse = require(script.Parent.Parent:WaitForChild("mouseEvents"));
	local customSelectionBox = require(script.Parent.Parent:WaitForChild("ui"):WaitForChild("customSelectionBox"));

	--------------- Functions: ---------------

	local getScale = function()
		return shared.better_chat.getSize();
	end
	
	local getPadding = function()
		return getScale() * 0.7;
	end
	
	local tweenProperties = function(object,properties,length)
		game:GetService("TweenService"):Create(object,TweenInfo.new(length or 0.16,Enum.EasingStyle.Quad,Enum.EasingDirection.Out),properties):Play();
	end
	
	local getBounds = function(text)
		return game:GetService("TextService"):GetTextSize(text,getScale(),font,Vector2.new(math.huge,getScale()));
	end
	
	local scale = function(text)
		if(ui:GetFullName() ~= ui.Name) then
			ui.Label.TextSize = getScale();
			local textSize = game:GetService("TextService"):GetTextSize(text,ui.Label.TextSize,ui.Label.Font,Vector2.new(ui.Label.AbsoluteSize.X,math.huge));
			local ySize = getPadding() + (getScale() * (textSize.Y/ui.Label.TextSize));
			local newSize = UDim2.new(1,-((ui.Label.TextSize/1.5)/2),0,ySize);
			ui.Size = newSize;
			ui.Label.Size = UDim2.new(1,(-ui.Label.TextSize),1,0);
			functions:scale();
		end
	end
	
	local format = function(text)
		return richText.markdown_format(text);
	end
	
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
	
	local italics = function(text)
		return string.format("<i>%s</i>",text);
	end
	
	local isAtBottom = function(f)
		local yCanvasSize = f.CanvasSize.Y.Offset;
		local yContainerSize = f.AbsoluteWindowSize.Y;
		local yScrolledPosition = f.CanvasPosition.Y;
		return (yCanvasSize < yContainerSize or yCanvasSize - yScrolledPosition <= yContainerSize + getScale() * 1.5);
	end

	local isHoveringOnName = function(position)
		local relativePosition = Vector2.new(position.X,position.Y) - ui.Label.AbsolutePosition;
		local absoluteSize = getBounds(preFormat[3]).X;
		if(relativePosition.X <= absoluteSize) then
			if(relativePosition.Y <= getScale()) then
				if(relativePosition.X >= (absoluteSize - getBounds(preFormat[2]).X)) then
					if(table.find(playerGui:GetGuiObjectsAtPosition(playerMouse.X,playerMouse.Y),ui)) then
						if(messageData.isPlayer) then
							return true;
						end
					end
				end
			end
		end
		return false;
	end
	
	local onClick = function(position)
		if(isHoveringOnName(position)) then
			initializeWhisper(chat,messageData.player);
		end
	end

	local shallowCopy = function(original)
		local copy = {};
		for key,value in pairs(original) do
			copy[key] = value;
		end
		return copy;
	end
	
	local getMessage = function(messageData)
		return(messageData.isFiltered and messageData.message or string.rep("_",messageData.messageLength));
	end
	
	local getMessageObject = function(b)
		local copy = shallowCopy(messageData);
		if(b == false) then
			copy.usingDisplayName = true;
		else
			copy.usingDisplayName = false;
		end
		copy.fromSpeaker = copy.isPlayer and copy.player.Name or copy.fromSpeaker;
		return copy;
	end
	
	local scaleUI = function()
		scale(richText.stripTags(richText.markdown_format(lastMessage)));
		scroller.CanvasSize = UDim2.new(0,0,0,scroller:FindFirstChildOfClass("UIListLayout").AbsoluteContentSize.Y);
		tweenProperties(scroller,{
			CanvasPosition = Vector2.new(0,scroller:FindFirstChildOfClass("UIListLayout").AbsoluteContentSize.Y);
		},0.1)
	end
	
	--------------- Methods: ---------------
	
	function object:updateText(newObject,ignore)
		if(newObject.options ~= nil and newObject.options.textColor ~= nil) then
			ui.Label.TextColor3 = newObject.options.textColor;
		end

		local original = newObject.fromSpeaker;
		local isDisplayName = false;
		messageData = newObject or messageData;
		ui.Name = messageData.ID;
		
		if(displayNamesEnabled and messageData.isPlayer and not ignore) then
			if(messageData.player.DisplayName ~= messageData.player.Name) then
				isDisplayName = true;
				messageData.fromSpeaker = messageData.player.DisplayName;
				messageData.usingDisplayName = true;
			end			
		else
			messageData.usingDisplayName = false;
		end

		local msg = getMessage(messageData);
		local nametag = string.format("%s: ",messageData.fromSpeaker);
		local tags = "";
		
		if(isWhisper) then
			if(messageData.isPlayer and messageData.player == localPlayer) then
				messageData.chatTags = {{
					Color = Color3.fromRGB(223, 107, 106),
					Text = "To "..messageData.toSpeaker
				}};
			else
				messageData.chatTags = {{
					Color = Color3.fromRGB(223, 107, 106),
					Text = "From "..messageData.fromSpeaker
				}};
			end
		elseif(messageData.isTeamMessage) then
			messageData.chatTags = {{
				Color = Color3.fromRGB(223, 107, 106),
				Text = "Team"
			}};
		end
		
		functions:clearChildren()
		if(messageData.chatTags) then
			for key,tag in pairs(messageData.chatTags) do
				tags = tags.. (tag.Icon and (" "):rep(5) or "") ..string.format("[%s] ",tag.Text);

				if tag.Icon then
					functions:AddIconLabel(tag.Icon)	
				end
			end
		end
		
		if(messageData.fromSpeaker == "") then
			nametag = "";
		end
		
		local fullMessage = tags..nametag..msg;
		lastMessage = fullMessage;
		preFormat = {tags,nametag,tags..nametag}
		nametag = getColorTag(isDisplayName and displayNamesItalics and italics(nametag) or nametag,messageUtility:getNameColor(messageData));
		
		local tags = "";
		
		functions:clearChildren()
		if(messageData.chatTags ~= nil) then
			for _,tag in ipairs(messageData.chatTags) do
				tags = tags.. (tag.Icon and (" "):rep(5) or "") ..getColorTag(string.format("[%s] ",tag.Text),tag.Color);
				
				if tag.Icon then
					functions:AddIconLabel(tag.Icon)	
				end
			end
		end
		
		msg = format(msg);
		local checkMentioned = function()
			if(msg:find(mentionTag(localPlayer.Name)) or displayNamesEnabled and msg:find(mentionTag(localPlayer.DisplayName))) then
				functions:markMentioned();
				functions:scale();
			end
			for _,player in pairs(game:GetService("Players"):GetPlayers()) do
				local mention = mentionTag(player.Name);
				local old = msg;
				msg = msg:gsub(mention,getColorTag(string.format("@%s",messageData.usingDisplayName and player.DisplayName or player.Name),Color3.fromRGB(255,255,127)));
				if(msg == old) then
					msg = msg:gsub(mentionTag(player.DisplayName),getColorTag(string.format("@%s",messageData.usingDisplayName and player.DisplayName or player.Name),Color3.fromRGB(255,255,127)));
				end
			end
		end
		
		local autoSizeAndScroll = function()
			local doScroll = false;
			if(isAtBottom(scroller)) then
				doScroll = true;
			end
			scroller.CanvasSize = UDim2.new(0,0,0,layout.AbsoluteContentSize.Y);
			if(doScroll) then
				tweenProperties(scroller,{
					CanvasPosition = Vector2.new(0,layout.AbsoluteContentSize.Y);
				},0.1)
			end
		end
		
		scale(richText.stripTags(tags..nametag..msg));
		
		checkMentioned();
		ui.Label.Text = tags..nametag..msg;
		if(selectionEnabled) then
			ui.SelectionBox.Text = richText.stripTags(tags..nametag..msg);
			customSelectionBox(ui.SelectionBox);
		end
		autoSizeAndScroll();
	end
	
	--------------- Setup: ---------------
	
	object:updateText(messageData);
	ui.Parent = chat.Container.ChatWindow.Scroller;

	shared.better_chat.messageData[ui] = {
		scale = scaleUI
	}
	
	local automaticScaleConnection;
	automaticScaleConnection = workspace.CurrentCamera:GetPropertyChangedSignal("ViewportSize"):Connect(function()
		game:GetService("RunService").Heartbeat:Wait();
		scaleUI();
	end)
	
	local whisperClickConnection;
	whisperClickConnection = game:GetService("UserInputService").InputBegan:Connect(function(input)
		if(insideFrame) then
			if(input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseButton1) then
				onClick(input.Position);
			end
		end
	end)
	
	local isInside = false;
	local hoverConnection;
	hoverConnection = game:GetService("RunService").Heartbeat:Connect(function()
		if(displayNamesEnabled == true) then
			local bool = isHoveringOnName(Vector2.new(playerMouse.X,playerMouse.Y));
			if(bool and isInside == false) then
				isInside = true;
				object:updateText(getMessageObject(false),true);
			elseif(isInside == true and not bool) then
				isInside = false;
				object:updateText(getMessageObject(true));
			end
		end
	end)
	
	mouse.combination(ui,function(boolean)
		insideFrame = boolean;
	end)
	
	function object:disconnect()
		object.destroyInternalConnections();
		automaticScaleConnection:Disconnect();
		whisperClickConnection:Disconnect();
		hoverConnection:Disconnect();
		shared.better_chat.messageData[ui] = nil;
		ui:Destroy();
	end
	
	object.ui = ui;
	
	--------------- Return: ---------------

	return object;
end