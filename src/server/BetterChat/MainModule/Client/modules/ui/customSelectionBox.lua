--[[
	This will create a custom selection box due to the default one being unsupported by nature.
]]

return function(messageUI)
	--------------- Variables: ---------------

	local selecting = false;
	
	--------------- Objects: ---------------

	local selectedField = Instance.new("Frame");
	selectedField.Size = UDim2.new(0,0,0,0);
	selectedField.BackgroundColor3 = Color3.new(0.568627, 0.764706, 1);
	selectedField.BackgroundTransparency = 0.75;
	selectedField.AnchorPoint = Vector2.new(0,1);
	selectedField.Name = "SelectionUI";
	selectedField.BorderSizePixel = 0;
	
	--------------- Functions: ---------------

	local function getWrappedLines() -- skidded from https://www.roblox.com/users/19690989/profile
		local prep = {messageUI.TextSize,messageUI.Font,messageUI.AbsoluteSize};
		local lines = {""};
		local ySize;
		for i = 1,#messageUI.Text do
			local currentSize = game:GetService("TextService"):GetTextSize(messageUI.Text:sub(1,i),unpack(prep));
			if not ySize then ySize = currentSize.Y end;
			if(currentSize.Y ~= ySize) then
				ySize = currentSize.Y;
				lines[#lines+1] = "";
			end
			lines[#lines] ..= messageUI.Text:sub(i,i);
		end
		return lines;
	end
	
	local function getBounds(text,limit)
		limit = limit or messageUI.AbsoluteSize;
		return game:GetService("TextService"):GetTextSize(text,messageUI.TextSize,messageUI.Font,limit);
	end
	
	local getText = function()
		return messageUI.Text;
	end
	
	local visualize = function()
		for _,v in pairs(messageUI:GetChildren()) do
			if(v.Name == "SelectionUI") then
				v:Destroy();
			end
		end
		local wrappedLines = getWrappedLines(getText(),messageUI.AbsoluteSize);
		local positioned = false;
		if(not(messageUI.CursorPosition == -1 or messageUI.SelectionStart == -1)) then
			selecting = true;
			local positionA = math.min(messageUI.CursorPosition,messageUI.SelectionStart);
			local positionB = math.max(messageUI.CursorPosition,messageUI.SelectionStart);
			local selectedText = getText():sub(positionA,positionB);
			local num = 0;						
			for i = 1,#wrappedLines do
				num += string.len(wrappedLines[i]);
				if(num >= positionA and not positioned) then
					local previous = num - string.len(wrappedLines[i]);
					local selected = wrappedLines[i]:sub(positionA-previous,positionB-previous);
					positioned = true;
				end
				if(num >= positionA) then
					local previous = num - string.len(wrappedLines[i]);
					local notSelected = wrappedLines[i]:sub(0,(positionA-previous)-1);
					local selected = wrappedLines[i]:sub(positionA-previous,positionB-previous);
					if(selected ~= notSelected) then
						local clone = selectedField:Clone();
						clone.Parent = messageUI;
						clone.Size = UDim2.new(0,getBounds(selected).X,0,messageUI.TextSize + (messageUI.TextSize*0.3));
						clone.Position = UDim2.new(0,getBounds(notSelected).X,0,messageUI.TextSize * i + (messageUI.TextSize*0.3));
					end
				end
			end
		else
			selecting = false;
		end
	end
	
	--------------- Connections: ---------------
	
	messageUI:GetPropertyChangedSignal("CursorPosition"):Connect(visualize);
	messageUI:GetPropertyChangedSignal("SelectionStart"):Connect(visualize);
end