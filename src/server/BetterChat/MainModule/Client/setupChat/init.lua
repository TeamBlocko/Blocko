--[[
	This module will setup a chain reaction that sets up all of the other modules in the system.
]]

return function(...)
	--------------- Fetch modules: ---------------

	local modules = {
		chatbar = require(script:WaitForChild("chatbar")),
		createMessage = require(script:WaitForChild("createMessage")),
		chatContainer = require(script:WaitForChild("chatContainer")),
	}
	
	--------------- Setup: ---------------
	
	modules.chatbar(...);
	modules.createMessage(...);
	modules.chatContainer(...);
end