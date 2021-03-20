--[[
	This creates the message's UI.
]]

return function(font,textStroke,selectionEnabled)
	local defaultMessage = Instance.new("Frame");
	local messageLabel = Instance.new("TextLabel");
	local mentionTag = Instance.new("Frame");
	local corner = Instance.new("UICorner");
	local selectionBox = Instance.new("TextBox");
	local aspectConstraint = Instance.new("UIAspectRatioConstraint");
	local isMentioned = false;
	
	defaultMessage.Name = "DefaultMessage";
	defaultMessage.BackgroundColor3 = Color3.fromRGB(255,255,255);
	defaultMessage.BackgroundTransparency = 1.000;
	defaultMessage.Size = UDim2.new(0.9965,0,0,30);
	defaultMessage.BorderSizePixel = 0;
	
	messageLabel.Name = "Label";
	messageLabel.Parent = defaultMessage;
	messageLabel.AnchorPoint = Vector2.new(0.5,0.5);
	messageLabel.BackgroundColor3 = Color3.fromRGB(255,255,255);
	messageLabel.BackgroundTransparency = 1.000;
	messageLabel.Position = UDim2.new(0.5,0,0.5,0);
	messageLabel.Size = UDim2.new(0.98,0,1,0);
	messageLabel.Font = font;
	messageLabel.Text = "";
	messageLabel.TextColor3 = Color3.fromRGB(255,255,255);
	messageLabel.TextSize = 16.000;
	messageLabel.TextWrapped = true;
	messageLabel.TextXAlignment = Enum.TextXAlignment.Left;
	messageLabel.RichText = true;
	
	if(selectionEnabled) then
		selectionBox.Parent = defaultMessage;
		selectionBox.Name = "SelectionBox";
		selectionBox.AnchorPoint = Vector2.new(0.5,0.5);
		selectionBox.BackgroundColor3 = Color3.fromRGB(255,255,255);
		selectionBox.BackgroundTransparency = 1.000;
		selectionBox.BorderSizePixel = 0;
		selectionBox.Position = UDim2.new(0.5,0,0.550000012,0);
		selectionBox.Size = UDim2.new(0.980000019,0,1,0);
		selectionBox.ZIndex = 0;
		selectionBox.ClearTextOnFocus = false;
		selectionBox.Font = font;
		selectionBox.TextColor3 = Color3.fromRGB(255,255,255);
		selectionBox.TextXAlignment = Enum.TextXAlignment.Left;
		selectionBox.TextEditable = false;
		selectionBox.Text = "";
		selectionBox.TextTransparency = 1;
		selectionBox.TextWrapped = true;
	end
	
	messageLabel.TextStrokeTransparency = textStroke.Transparency;
	messageLabel.TextStrokeColor3 = textStroke.Color;
	
	local iconsFolder = Instance.new("Folder")
	iconsFolder.Name = "Icons"
	iconsFolder.Parent = defaultMessage	
	
	local functionality = {};
	
	function functionality:scale()
		selectionBox.TextSize = messageLabel.TextSize;
	end
	
	function functionality:markMentioned()
		if(isMentioned == false) then
			isMentioned = true;
			mentionTag.Parent = defaultMessage;
			mentionTag.AnchorPoint = Vector2.new(0,0.5);
			mentionTag.BackgroundColor3 = Color3.fromRGB(252,166,85);
			mentionTag.BorderSizePixel = 0;
			mentionTag.Position = UDim2.new(0,0,0.5,0);
			mentionTag.Size = UDim2.new(0.009,0,1,0);
			
			aspectConstraint.Parent = mentionTag;
			aspectConstraint.AspectRatio = 0.16;
			
			local clone = corner:Clone();
			clone.Name = "message_roundness";
			clone.CornerRadius =  UDim.new(0.15,0);
			clone.Parent = defaultMessage;

			defaultMessage.BackgroundColor3 = Color3.fromRGB(255,170,0);
			defaultMessage.BackgroundTransparency = 0.75;
		end
	end
	
	local numberOfIcons = 0

	function functionality:clearChildren()
		numberOfIcons = 0
		iconsFolder:ClearAllChildren()
	end
	
	function functionality:AddIconLabel(iconAddress)
		local iconSize=Vector2.new(18, 18) --use the constant we defined earlier
		local IconLabel= Instance.new("ImageLabel")
		--set various properties of the IconLabel to what we want.
		IconLabel.Selectable=false
		IconLabel.Size=UDim2.new(0,iconSize.X,0,iconSize.Y)
		IconLabel.Position=UDim2.new(0,numberOfIcons * iconSize.X + numberOfIcons ~= 0 and 4 or 0,0,0)
		IconLabel.BackgroundTransparency=1
		IconLabel.ImageTransparency=0
		IconLabel.ScaleType=Enum.ScaleType.Fit
		IconLabel.ImageColor3=Color3.new(1,1,1)
		--Assign the IconLabel the image we want.
		IconLabel.Image=iconAddress
		IconLabel.Visible=true
		--Add it to the base message.
		IconLabel.Parent=iconsFolder

		--Return it to wherever the function was called from.
		return IconLabel
	end

	return defaultMessage,functionality;
end