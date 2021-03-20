--[[
	This is the primary setup module. It'll initialize the entire chat system.
]]

return function(configuration,plugins)
	--------------- Ensure that "LoadDefaultChat" is disabled: ---------------

	assert(not game:GetService("Chat").LoadDefaultChat,"[BETTER CHAT]: Please disable [Chat > LoadDefaultChat] or there will be overlap between the chat systems.");
	
	--------------- Setup "shared" variable: ---------------

	shared.better_chat = {
		configuration = configuration,
	}
		
	--------------- Setup "shared" folder: ---------------
	
	local sharedFolder = script:WaitForChild("Shared");
	sharedFolder.Name = "BetterChatShared";
	sharedFolder.Parent = game:GetService("ReplicatedStorage");
	
	--------------- Initialize clients: ---------------

	local client = script:WaitForChild("Client");
	client.Name = "ChatClient";
	client.Parent = game:GetService("StarterPlayer").StarterPlayerScripts;
	
	--------------- Give "client" plugins to the clients: ---------------

	for _,v in pairs(plugins:WaitForChild("Client"):GetChildren()) do
		v.Parent = sharedFolder:WaitForChild("clientPlugins");
	end
	
	--------------- Setup more shared variables: ---------------

	shared.better_chat.sharedFolder = sharedFolder;
	shared.better_chat.network = require(sharedFolder:WaitForChild("network"));
	shared.better_chat.better_wait = require(sharedFolder:WaitForChild("betterWait"));
	
	--------------- Initialize Server: ---------------

	local server = script:WaitForChild("Server");
	server.Parent = game:GetService("ServerScriptService");
	server:WaitForChild("serverRunner").Disabled = false;
	
	--------------- Run plugins: ---------------

	require(server:WaitForChild("pluginHandler"):WaitForChild("handler"))(plugins:WaitForChild("Server"));
end