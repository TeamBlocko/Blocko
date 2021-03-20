--[[
	This message is called to post an actual message to the chat.
]]

return function(message,configuration,network)
	--------------- Clean message: ---------------

	local fixWhitespace = function(message)
		local disallowedWhitespace = {"\n","\r","\t","\v","\f"};
		for _,character in pairs(disallowedWhitespace) do
			if(character == "\t") then
				message = message:gsub(character,string.char(32));
			else
				message = message:gsub(character,"");
			end
		end
		message = message:gsub("\n","");
		message = message:gsub("[ ]+"," ");
		return message;
	end
	
	--------------- Fire the player's .Chatted event: ---------------
	
	if(shared.better_chat.wholeConfig.Security.ChattedEvent.HidePrivateMessages) then
		if not (shared.better_chat.whisperData.user ~= nil or shared.better_chat.teamChatEnabled) then
			shared.better_chat.connectionsList.MessagePosted:Fire(fixWhitespace(message));
		end
	else
		shared.better_chat.connectionsList.MessagePosted:Fire(fixWhitespace(message));
	end
	
	--------------- Network: ---------------

	local channel = "all";
	local success,result = network:invokeServer("requestMessage",fixWhitespace(message),channel,shared.better_chat.whisperData,shared.better_chat.teamChatEnabled);
	if(not success and result) then
		shared.better_chat.messageCreators.systemMessage(result,channel);
	end
end