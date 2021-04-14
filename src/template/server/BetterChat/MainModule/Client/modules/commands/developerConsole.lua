--[[
	This module is linked with "/console" and toggles the developer console.
]]

return function(message)
	local starterGui = game:GetService("StarterGui");
	local success,developerConsoleVisible = pcall(function() 
		return starterGui:GetCore("DevConsoleVisible") 
	end);
	
	if(success) then
		local success,err = pcall(function() starterGui:SetCore("DevConsoleVisible",not developerConsoleVisible) end);
		if(not success and err) then
			warn("[BETTER CHAT]: Failed to make developer console visible:",err);
		end
	end
end