--[[
	This module produces a fading effect when the user interacts with the chat system.
]]

return function(window,mouse,config)
	--------------- Variables: ---------------

	local box = window:WaitForChild("Chatbar"):WaitForChild("Box");
	local scroller = window:WaitForChild("Scroller");
	local autofill = window:WaitForChild("Autofill");
	local mouseInWindow = false;
	local fadedIn = false;
	local information = TweenInfo.new(0.16,Enum.EasingStyle.Quad,Enum.EasingDirection.Out);
	shared.better_chat.canFade = true;
	
	--------------- Fade configuration: ---------------

	local fadedOutTransparency = config.FadedOutChatWindowTransparency or 1;
	local fadedInTransparency = config.FadedInChatWindowTransparency or 0.75;
	local placeholderFadedIn = config.ChatbarFadeInPlaceholderColor or Color3.fromRGB(100,100,100);
	local placeholderFadedOut = config.ChatbarFadeOutPlaceholderColor or Color3.fromRGB(255,255,255);
	local fadedInBoxTransparency = config.FadeInChatbarTransparency or 0;
	local fadedOutBoxTransparency = config.FadeOutChatbarTransparency or 1;
	
	--------------- Functions: ---------------

	local tweenProperties = function(object,properties)
		game:GetService("TweenService"):Create(object,information,properties):Play();
	end
	
	local get = function()
		return(workspace.CurrentCamera.ViewportSize.X * 0.0030832476875642);
	end

	local tween = function(tbl)
		for i = 1,(#tbl/2) do
			tweenProperties(tbl[(i*2)-1],tbl[i*2]);
		end
	end

	local fadeIn = function()
		if(shared.better_chat.canFade) then
			tween({
				window,{
					BackgroundTransparency = fadedInTransparency
				},box.Parent,{
					BackgroundTransparency = fadedInBoxTransparency
				},box,{
					PlaceholderColor3 = placeholderFadedIn
				},scroller,{
					ScrollBarThickness = get()
				},autofill,{
					BackgroundTransparency = fadedInTransparency
				}
			});
			fadedIn = true;
			shared.better_chat.fade:Fire(true);
		end
	end

	local fadeOut = function()
		if(shared.better_chat.canFade) then
			tween({
				window,{
					BackgroundTransparency = fadedOutTransparency
				},box.Parent,{
					BackgroundTransparency = fadedOutBoxTransparency
				},box,{
					PlaceholderColor3 = placeholderFadedOut
				},scroller,{
					ScrollBarThickness = 0
				},
				autofill,{
					BackgroundTransparency = fadedOutTransparency
				}
			});
			fadedIn = false;
			shared.better_chat.fade:Fire(false);
		end
	end
	
	--------------- Events: ---------------

	mouse.mouseEnter(window,function()
		mouseInWindow = true;
		fadeIn();
	end)

	mouse.mouseLeave(window,function()
		mouseInWindow = false;
		if(box.Text == "" and not box:IsFocused()) then
			fadeOut();
		end
	end)
	
	if(game:GetService("Chat"):CanUserChatAsync(game:GetService("Players").LocalPlayer.UserId)) then		
		box.Focused:Connect(function()
			fadeIn();
		end)

		box.FocusLost:Connect(function(enterPressed)
			game:GetService("RunService").Heartbeat:Wait();
			if(box.Text == "") then
				fadeOut();
			end
		end);
	end
	
	workspace.CurrentCamera:GetPropertyChangedSignal("ViewportSize"):Connect(function()
		game:GetService("RunService").Heartbeat:Wait();
		if(fadedIn) then
			tween({
				scroller,{
					ScrollBarThickness = get();
				}
			})
		end
	end)
	
	game:GetService("Players").LocalPlayer:GetMouse().Move:Connect(function()
		if(not mouseInWindow and fadedIn == true and not box:IsFocused() and box.Text == "") then
			fadeOut();
		end
	end)
	
	game:GetService("UserInputService").InputBegan:Connect(function(input)
		if(input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch) then
			if(mouseInWindow == false and box.Text == "" and not box:IsFocused()) then
				fadeOut();
			end
		end
	end)
end