return function(serverPlugins)
	local API = require(script:WaitForChild("API"));
	for _,pluginModule in pairs(serverPlugins:GetChildren()) do
		local clone = pluginModule:Clone();
		clone.Parent = script.Parent:WaitForChild("plugins");
		coroutine.wrap(function()
			require(clone)(API)
		end)();
	end
end