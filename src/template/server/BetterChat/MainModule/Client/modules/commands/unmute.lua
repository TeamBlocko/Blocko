--[[
	This module is linked with "/unmute" or "/unignore" and toggles muting a speaker.
]]

return function(message)
	local player = message:gsub("/unmute ",""):gsub("/unignore ","");
	if(string.len(player) >= 1) then
		shared.better_chat.unmuteSpeaker(player);
	end
end