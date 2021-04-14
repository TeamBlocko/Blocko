--[[
	This module will be used in the plugin API system to create artificial bubble chats.
]]

--------------- Module: ---------------

local apiAccess = {};

--------------- Methods: ---------------

function apiAccess.newSpeaker(parent,name,player)
	assert(parent ~= nil,"Expected type \"Instance\" for parameter \"parent\".");
	name = name or game:GetService("HttpService"):GenerateGUID();
	if(not (parent.ClassName and type(parent) ~= "table")) then
		error("Expected type \"Instance\" for parameter \"parent\".")
	end
	
	local billboardGui = require(script.Parent:WaitForChild("billboardGui"));
	local functions = billboardGui.create(parent,name,player);
	local connection;
	connection = game:GetService("RunService").Heartbeat:Connect(function()
		if(parent:GetFullName() == parent.Name) then
			connection:Disconnect();
			functions.ui:Destroy();
		end
	end)
	
	local methods = {};
		
	function methods:say(message)
		assert(type(message) == "string","Expected type \"string\" for parameter \"message\".");
		local bubble,connection = functions.chatBubble.create(message);
		local conn;
		conn = game:GetService("RunService").Heartbeat:Connect(function()
			if(bubble:GetFullName() == bubble.Name) then
				conn:Disconnect();
				connection:Disconnect();
			end
		end)
		return bubble;
	end
	
	function methods:getUI()
		return functions.ui;
	end
	
	return methods;
end

--------------- Return: ---------------

return apiAccess;