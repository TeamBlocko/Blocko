--[[
	This module will setup the chat scroller system. This limits you from having too many messages and loads message history.
]]

return function(chat,configuration,network,serverConfig,richText,detectPlatform)
	--------------- Variables: ---------------

	local scroller = chat.Container.ChatWindow.Scroller;
	local currentHistory = {};
	local limit = serverConfig.MessageHistoryLength;
	
	--------------- Functions: ---------------
	
	local tweenProperties = function(object,properties)
		game:GetService("TweenService"):Create(
			object,
			TweenInfo.new(
				0.16,
				Enum.EasingStyle.Quad,
				Enum.EasingDirection.Out
			),
			properties
		):Play();
	end
	
	local loadMessages = function(channelName)
		currentHistory = {};
		for _,v in pairs(scroller:GetChildren()) do
			if(v:IsA("Frame") and v.Name ~= "SizeRatio") then
				shared.better_chat.messageCreators.getObjectFromUI(v):disconnect();
			end
		end
		local messagesList = network:invokeServer("requestHistory",channelName);
		for _,message in pairs(messagesList) do
			shared.better_chat.messageCreators.onCreate(message);
		end
		game:GetService("RunService").Heartbeat:Wait();
		tweenProperties(scroller,{
			CanvasPosition = Vector2.new(0,(scroller.CanvasSize.Y.Offset - scroller.AbsoluteSize.Y));
		},0.1)
	end
	
	--------------- Connections: ---------------

	scroller.ChildAdded:Connect(function(object)
		table.insert(currentHistory,1,object);
		if(#currentHistory > limit) then
			for i = 1,#currentHistory do
				if(i > limit) then
					shared.better_chat.messageCreators.getObjectFromUI(currentHistory[i]):disconnect();
					table.remove(currentHistory,i);
				end
			end
		end
	end)
	
	--------------- Setup: ---------------
	
	loadMessages("all");
end