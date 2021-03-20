--[[
	This module is linked with "/help" and "/?" and sends the help message.
]]

return function(message)
	local send = shared.better_chat.messageCreators.systemMessage;
	send("List of basic chat commands","all","");
	
	local list = {
		"/emote <emote name> or /e <emote name>: Make your character peform the emote named.",
		"/whisper <speaker> or /w <speaker>: Open a private channel with the speaker.",
		"/mute <speaker>: Mutes the specified speaker on your client.",
		"/unmute <speaker>: Unmutes the specified speaker on your client."
	}
	
	for _,object in pairs(list) do
		send(object,"all","");
	end
end