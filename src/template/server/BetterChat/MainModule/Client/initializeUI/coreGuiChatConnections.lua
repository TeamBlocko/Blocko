--[[
	This module links the topbar's chat button click to opening the UI. It also sets up stuff like
	the ".Chatted" event, and the message counter.
]]

return function(window)
	--------------- Variables: ---------------

	local connectionsList = {}
	local tries = 0;
	local maxAttempts = 35;
	
	--------------- Functions: ---------------

	local function addObjects(bindableClass,targetName,...)
		local target = connectionsList[targetName];
		if(not target) then
			target = {};
			connectionsList[targetName] = target;
		end
		local names = {...};
		for _,name in pairs(names) do
			local signal = Instance.new(bindableClass);
			signal.Parent = script;
			signal.Name = targetName.."_"..name;			
			target[name] = signal;
		end
	end
	
	--------------- Setup events: ---------------

	addObjects(
		"BindableEvent","ChatWindow","ToggleVisibility","SetVisible","FocusChatBar","TopbarEnabledChanged","SpecialKeyPressed",
		"CoreGuiEnabled","ChatBarFocusChanged","VisibilityStateChanged", "MessagesChanged","MessagePosted"
	)
	
	--------------- Connect events: ---------------

	while(tries < maxAttempts) do
		local success,result = pcall(function()
			game:GetService("StarterGui"):SetCore("CoreGuiChatConnections",connectionsList);
		end)
		if(success) then
			break;
		else
			tries += 1;
			if(tries == maxAttempts) then
				error("Error calling SetCore CoreGuiChatConnections:",result);
			else
				wait();
			end
		end
	end
	
	--------------- Link chat button clicked: ---------------
	
	shared.better_chat.connectionsList = connectionsList.ChatWindow;
	
	local callback = function(enabled)
		local s = shared.better_chat.currentSize;
		window.Parent:TweenSize(UDim2.new(s.X.Scale,0,enabled and s.Y.Scale or 0,0),Enum.EasingDirection.Out,Enum.EasingStyle.Quad,0.12,true,function(finished)
			if(finished and enabled) then
				for _,v in pairs(shared.better_chat.messageData or {}) do
					v.scale();
				end
				shared.better_chat.forceScale();
			end
		end)
		window.Parent.ClipsDescendants = not enabled; 
	end

	local enabled = false;
	local toggle = function()
		connectionsList.ChatWindow.VisibilityStateChanged:Fire(not enabled);
		enabled = not enabled;
		callback(enabled);
	end
	
	for i = 1,3 do
		toggle();
	end
	
	connectionsList.ChatWindow.ToggleVisibility.Event:Connect(toggle);
end