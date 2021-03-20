--[[
	This module will create a chat bubble.
]]

return function(ui,util,stack,richText,player)
	--------------- Variables: ---------------

	local module = {};
	local config = require(game:GetService("ReplicatedStorage").BetterChatShared:WaitForChild("network")):invokeServer("requestConfig");
	local padding = util.padding;
	local textSize = util.textSize;
	local font = util.font;
	local backgroundColor = util.backgroundColor;
	local textColor = util.textColor;
	local a = "ChatBubbleColor";
	local b = "ChatBubbleTextColor";
	local c = "TypingIndicatorColor";
	local bubbleChat = config.ChatSettings.Client.BubbleChat.Settings;
	
	--------------- Functions: ---------------
	
	local createTween = function(object,properties,length)
		return game:GetService("TweenService"):Create(object,TweenInfo.new(length or 0.16,bubbleChat.EasingStyle or Enum.EasingStyle.Quad,Enum.EasingDirection.Out,0,true,0),properties);
	end

	function module.makeUI(bounds,text)
		local addon = 0;
		local bubble = Instance.new("Frame");
		local rounded = Instance.new("UICorner");
		local label = Instance.new("TextLabel");
		local caret = Instance.new("ImageLabel");
		local constraint = Instance.new("UITextSizeConstraint");
		local lines = (bounds.Y/textSize);
				
		if(richText.stripTags(text) ~= text) then
			addon = 3;
		end
		
		bubble.Name = "Bubble";
		bubble.BackgroundColor3 = (player ~= nil and player:GetAttribute(a) ~= nil and player:GetAttribute(a) or backgroundColor);
		bubble.Size = UDim2.new(0,bounds.X + (padding * 2) + addon,0,bounds.Y + (padding * 2));
		bubble.AnchorPoint = Vector2.new(0.5,1);
		bubble.Position = UDim2.new(0.5,0,0.9,0);
		
		rounded.CornerRadius = UDim.new(bubbleChat.Roundness or 0.1,0);
		rounded.Name = "Rounded";
		rounded.Parent = bubble;

		label.Name = "Label";
		label.Parent = bubble;
		label.AnchorPoint = Vector2.new(0.5,0.5);
		label.BackgroundColor3 = Color3.fromRGB(0,0,0);
		label.BackgroundTransparency = 1.000;
		label.Position = UDim2.new(0.5,0,0.5,0);
		label.Size = UDim2.new(1,0,1,0);
		label.Font = font;
		label.TextColor3 = (player ~= nil and player:GetAttribute(b) ~= nil and player:GetAttribute(b) or textColor);
		label.TextSize = textSize;
		label.Text = text;
		label.TextWrapped = true;
		label.RichText = true;

		constraint.Parent = label;
		constraint.Name = "Constraint";

		caret.Name = "Caret";
		caret.Parent = bubble;
		caret.AnchorPoint = Vector2.new(0.5,0);
		caret.ImageColor3 = (player ~= nil and player:GetAttribute(a) ~= nil and player:GetAttribute(a) or backgroundColor);
		caret.BackgroundTransparency = 1.000;
		caret.Position = UDim2.new(0.5,0,0.99,0);
		caret.Size = UDim2.new(0,5,0,5);
		caret.Image = "rbxasset://textures/ui/InGameChat/Caret.png";
		
		return bubble;
	end
	
	function module.typingIndicator()
		local text = "...........";
		local bounds = util:getBounds(richText.stripTags(text),textSize,font,(util.relativeSize+padding));
		local bubble = module.makeUI(bounds,text);
		bubble.Parent = ui.Container;
		bubble.Label:Destroy();
		
		local frame = Instance.new("Frame");
		frame.Size = UDim2.new(1,0,1,0);
		frame.Parent = bubble;
		frame.BackgroundTransparency = 1
		frame.Name = "Dots";
		bubble.Visible = false;
		
		local createDot = function()
			local label = Instance.new("ImageLabel");
			label.Size = UDim2.new(0,12,0,12,0);
			label.BackgroundTransparency = 1;
			label.Image = "rbxassetid://6127647756";
			label.Name = "Dot";
			label.ImageColor3 = (player ~= nil and player:GetAttribute(c) ~= nil and player:GetAttribute(c) or util.typingIndicatorColor);
			label.AnchorPoint = Vector2.new(0.5,0.5);
			
			return label;
		end
		
		local dots = {};
		for i = 1,3 do
			local dot = createDot();
			dot.Parent = frame;
			dot.Position = UDim2.new(0.5,(i == 1 and -(dot.AbsoluteSize.X+5) or i == 2 and 0 or i == 3 and dot.AbsoluteSize.X+5),0.5,0);
			table.insert(dots,{dot,dot.Position});
		end
		
		coroutine.wrap(function()
			repeat
				for _,info in pairs(dots) do
					local old = info[2];
					local newPosition = UDim2.new(0.5,old.X.Offset,0.5,-(info[1].AbsoluteSize.X/6));
					local tween = createTween(info[1],{ImageTransparency = 0.5,Position = newPosition},0.3);
					tween:Play();
					tween.Completed:Wait();
				end
				wait(0.05);
			until bubble:GetFullName() == bubble.Name;
		end)();
		
		local connection;
		connection = game:GetService("RunService").Heartbeat:Connect(function()
			if(bubble:GetFullName() ~= bubble.Name) then
				bubble.BackgroundColor3 = (player ~= nil and player:GetAttribute(a) ~= nil and player:GetAttribute(a) or backgroundColor);
				for _,info in pairs(dots) do
					info[1].ImageColor3 = (player ~= nil and player:GetAttribute(c) ~= nil and player:GetAttribute(c) or util.typingIndicatorColor);
				end
			else
				connection:Disconnect();
			end
		end)
		
		return bubble;
	end
	
	function module.create(text)
		local bounds = util:getBounds(richText.stripTags(text),textSize,font,(util.relativeSize+padding));
		local bounds2 = util:getBounds("...",textSize,font,(util.relativeSize+padding));
		local chatBubble = module.makeUI(bounds,text);
		local distanceBubble = module.makeUI(bounds2,"...");
		chatBubble.Parent = ui.Container;
		distanceBubble.Parent = ui.Container;
		distanceBubble.Visible = false;
		distanceBubble.Name = "DistanceBubble";
		stack:push(chatBubble,distanceBubble);
		
		local connection;
		connection = game:GetService("RunService").RenderStepped:Connect(function()
			local adorneePart = ui.Adornee;
			if(workspace.CurrentCamera and adorneePart and adorneePart:GetFullName() ~= adorneePart.Name) then
				local distance = (workspace.CurrentCamera.CFrame.Position - adorneePart.Position).Magnitude;
				local isInsideRenderDistance = (distance < util.maxDistance);
				local isInsideTextDistance = (distance < util.maxTextDistance);
				chatBubble.Visible = isInsideRenderDistance;
				if(not isInsideTextDistance and isInsideRenderDistance) then
					distanceBubble.Visible = true;
					chatBubble.Visible = false;
				elseif(isInsideTextDistance and isInsideRenderDistance) then
					distanceBubble.Visible = false;
				elseif(not isInsideRenderDistance) then
					distanceBubble.Visible = false;
				end
				distanceBubble.Position = chatBubble.Position;
			else
				connection:Disconnect();
			end
		end)
		
		return chatBubble,connection;
	end
	
	--------------- Return: ---------------

	return module;
end