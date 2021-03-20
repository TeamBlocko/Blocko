--[[
	This module scales and positions the chatbar and chatwindow when typing to provide an
	auto-sizing chatbar that sizes up each time a line breaks.
]]

return function(box,detectPlatform,config,ratio)
	--------------- Variables: ---------------
	
	local textService = game:GetService("TextService");
	local runService = game:GetService("RunService");
	local platform = detectPlatform();
	local xLimits = {shared.better_chat.currentSize.X.Scale,0.9};
	local yLimits = {shared.better_chat.currentSize.Y.Scale,0.85};
	local offsetAmount = 1.25;
	local lastTime = 0;
	local sizerEnabled = config.ResizerEnabled;
	local chatbar = box.Parent;
	local chatWindow = chatbar.Parent;
	local container = chatWindow.Parent;
	local roundness = chatbar:WaitForChild("Roundness");
	local roundness2 = chatWindow:WaitForChild("Roundness");
	local ratioSize = chatWindow:WaitForChild("MessageTextSizeRatio");
	local scroller = chatWindow:WaitForChild("Scroller");
	local chat = chatWindow;
	local original = chatWindow.Size;
	local offset = config.RoundnessDivider;
	local dragger;
	local singleLineChatbarSize;
	local last;
	local touching = false;

	--------------- Events: ---------------

	shared.better_chat.fade = Instance.new("BindableEvent");
	
	--------------- Functions: ---------------
	
	function shared.better_chat.getRoundness()
		return UDim.new(0,ratioSize.TextBounds.Y / offset);
	end
	
	function shared.better_chat.getSize()
		return ratioSize.TextBounds.Y;
	end
	
	local proportionScale = function()
		local textSize = ratioSize.TextBounds.Y;
		for _,v in pairs(chatWindow:GetDescendants()) do
			if(v:IsA("UICorner")) then
				if(v.Parent.Name ~= "ChatbarCover" and v.Name ~= "message_roundness") then
					v.CornerRadius = UDim.new(0,textSize / offset);
				end
			end
		end
		box.TextSize = ratioSize.TextBounds.Y;
		box.ChatbarCover.TextSize = textSize;
	end
	
	local tweenProperties = function(object,properties,length)
		game:GetService("TweenService"):Create(object,TweenInfo.new(length or 0.16,Enum.EasingStyle.Quad,Enum.EasingDirection.Out),properties):Play();
	end
	
	local getBounds = function(txt)
		return textService:GetTextSize(
			txt or box.Text,
			box.TextSize,
			box.Font,
			Vector2.new(box.AbsoluteSize.X,math.huge)
		);
	end
	
	local scale = function()
		local textBounds = getBounds();
		local offset = (box.TextSize*offsetAmount);
		local chatbarSize = (textBounds.Y + offset);
		local lineCount = (textBounds.Y/box.TextSize);
		local previousSize = chatWindow.Size;
		local newChatWindowSize = UDim2.new(1,0,1,math.clamp(textBounds.Y + (platform == "Mobile" and offset/4 or 0) - offset,0,math.huge));
		local absoluteSize = 0;
		singleLineChatbarSize = (getBounds("...").Y + offset);

		chatWindow.Size = newChatWindowSize;
		absoluteSize = chatWindow.AbsoluteSize;
		chatWindow.Size = previousSize;

		chatWindow.Scroller.Position = UDim2.new(0.5,0,0,(workspace.CurrentCamera.ViewportSize.Y * 0.0081716036772217));
		scroller.Size = UDim2.new(1,(-box.TextSize/1.5),0,absoluteSize.Y - (chatbarSize + singleLineChatbarSize/2));

		chatWindow:TweenSizeAndPosition(
			newChatWindowSize,
			UDim2.new(0.5,0,0.5,(textBounds.Y - offset)/2),
			Enum.EasingDirection.Out,
			Enum.EasingStyle.Quad,
			0.1,
			true
		);

		chatbar:TweenSizeAndPosition(
			UDim2.new((sizerEnabled and 1 or 0.98),(sizerEnabled and -(singleLineChatbarSize*1.5) or 0),0,chatbarSize),
			UDim2.new((sizerEnabled and 0 or 0.5),(sizerEnabled and box.TextSize/1.85 or 0),1,-(singleLineChatbarSize/6)),
			Enum.EasingDirection.Out,
			Enum.EasingStyle.Quad,
			0.1,
			true
		);

		if(sizerEnabled and dragger) then
			dragger.Size = UDim2.new(0,singleLineChatbarSize,0,singleLineChatbarSize);
			dragger.Position = UDim2.new(1,(workspace.CurrentCamera.ViewportSize.X * 0.0025786487880351),0.5,0);
		end

		chatbar.AnchorPoint = Vector2.new((sizerEnabled and 0 or 0.5),1);
		box.Size = UDim2.new(1,(-box.TextSize*1.25),1,0);
	end
	
	local draggerLogic = function(frame)
		local mouse = game:GetService("Players").LocalPlayer:GetMouse();
		local userInputService = game:GetService("UserInputService");
		local heartbeat = runService.Heartbeat;

		local success,event = pcall(function()
			return frame.MouseEnter;
		end)

		local handle = function(x,y,objectPosition)
			local offset = game:GetService("GuiService"):GetGuiInset();
			local x = (x - objectPosition.X + (frame.Size.X.Offset * frame.AnchorPoint.X));
			local y = (y -  - objectPosition.Y + (frame.Size.Y.Offset * frame.AnchorPoint.Y));
			
			local xAxis = math.clamp(x/workspace.CurrentCamera.ViewportSize.X,unpack(xLimits));
			local yAxis = math.clamp((y+offset.Y)/workspace.CurrentCamera.ViewportSize.Y,unpack(yLimits));

			local newSize = UDim2.new(xAxis,0,yAxis,0);
			container:TweenSize(newSize,Enum.EasingDirection.Out,Enum.EasingStyle.Quad,0.1,true);
			shared.better_chat.currentSize = newSize;
			scale();

			tweenProperties(scroller,{
				CanvasPosition = Vector2.new(0,scroller:FindFirstChildOfClass("UIListLayout").AbsoluteContentSize.Y);
			},0.1)
		end

		if(success) then
			frame.Active = true;
			event:Connect(function()
				if(platform == "Desktop") then
					local input = frame.InputBegan:Connect(function(key)
						if(key.UserInputType == Enum.UserInputType.MouseButton1) then
							local objectPosition = Vector2.new(mouse.X - frame.AbsolutePosition.X, mouse.Y - frame.AbsolutePosition.Y);
							while heartbeat:Wait() and userInputService:IsMouseButtonPressed(Enum.UserInputType.MouseButton1) do
								shared.better_chat.canFade = false;
								handle(mouse.X,mouse.Y,objectPosition);
							end
							shared.better_chat.canFade = true;
						end
					end)

					local leave;
					leave = frame.MouseLeave:Connect(function()
						input:Disconnect();
						leave:Disconnect();
					end)
				else
					local touching = false;
					local touchConnection = game:GetService("UserInputService").TouchEnded:Connect(function(touch)
						touching = false;
					end)

					local input = game:GetService("UserInputService").TouchMoved:Connect(function(touch)
						touching = true;
						local objectPosition = Vector2.new(touch.Position.X - frame.AbsolutePosition.X, touch.Position.Y - frame.AbsolutePosition.Y);
						while heartbeat:Wait() and touching do
							shared.better_chat.canFade = false;
							handle(touch.Position.X,touch.Position.Y,objectPosition);
						end
						touchConnection:Disconnect();
						shared.better_chat.canFade = true;
					end)

					local leave;
					leave = frame.MouseLeave:Connect(function()
						input:Disconnect();
						leave:Disconnect();
					end)
				end
			end)
		end
	end
	
	shared.better_chat.forceScale = scale;
	
	--------------- UI: ---------------
	
	if(sizerEnabled) then
		dragger = Instance.new("Frame");
		local roundness = Instance.new("UICorner");
		local image = Instance.new("ImageButton");
		
		dragger.Parent = chatbar;
		dragger.AnchorPoint = Vector2.new(0,0.5);
		dragger.BackgroundColor3 = Color3.fromRGB(0,0,0);
		dragger.BorderSizePixel = 0;
		dragger.Position = UDim2.new(1,5,0.5,0);
		dragger.Name = "Dragger";
		dragger.BackgroundTransparency = 1;
		
		image.Name = "Input";
		image.Image = "rbxassetid://261880743";
		image.Size = UDim2.new(0.8,0,0.8,0);
		image.Position = UDim2.new(0.5,0,0.5,0);
		image.AnchorPoint = Vector2.new(0.5,0.5);
		image.Parent = dragger;
		image.BackgroundTransparency = 1;
		image.ImageTransparency = 1;
		draggerLogic(image);
		
		roundness.Name = "Roundness";
		roundness.Parent = dragger;
	end
		
	--------------- Events: ---------------
	
	shared.better_chat.fade.Event:Connect(function(fadeState)
		if(sizerEnabled) then
			tweenProperties(dragger,{BackgroundTransparency = (fadeState and 0.75 or 1)});
			tweenProperties(dragger.Input,{ImageTransparency = (fadeState and 0 or 1)});
		end
	end)
	
	workspace.CurrentCamera:GetPropertyChangedSignal("ViewportSize"):Connect(function()
		game:GetService("RunService").Heartbeat:Wait();
		tweenProperties(scroller,{
			CanvasPosition = Vector2.new(0,(scroller.CanvasSize.Y.Offset - scroller.AbsoluteSize.Y));
		},0.1)
	end)
	
	runService.RenderStepped:Connect(function()
		proportionScale();
		if(getBounds().Y ~= last and (lastTime == 0 or tick() - lastTime > 0.01)) then
			lastTime = tick();
			last = getBounds().Y;
			scale();
		end
	end)
end