--[[
	This module is linked with "/mute" or "/ignore" and toggles muting a speaker.
]]

return function(message)
	local player = message:gsub("/mute ",""):gsub("/ignore ","");
	if(string.len(player) >= 1) then
		shared.better_chat.muteSpeaker(player);
	end
end