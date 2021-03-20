--[[
	This module will setup the API and run all of the plugin modules.
]]

return function(...)
	local API = require(script:WaitForChild("API"));
	local sharedFolder = game:GetService("ReplicatedStorage"):WaitForChild("BetterChatShared");
	local clientPlugins = sharedFolder:WaitForChild("clientPlugins");
	API.finishSetup(...);
	for _,pluginModule in pairs(clientPlugins:GetChildren()) do
		local clone = pluginModule:Clone();
		clone.Parent = script.Parent:WaitForChild("plugins");
		coroutine.wrap(function()
			local func = require(clone);
			getfenv(func)["API"] = API;
			func();
		end)();
	end
end