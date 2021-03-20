--[[
	  ______    _                _    _   _       _   _  __ _           
	 |  ____|  (_)              | |  | \ | |     | | (_)/ _(_)          
	 | |__ _ __ _  ___ _ __   __| |  |  \| | ___ | |_ _| |_ _  ___ _ __ 
	 |  __| '__| |/ _ \ '_ \ / _` |  | . ` |/ _ \| __| |  _| |/ _ \ '__|
	 | |  | |  | |  __/ | | | (_| |  | |\  | (_) | |_| | | | |  __/ |   
	 |_|  |_|  |_|\___|_| |_|\__,_|  |_| \_|\___/ \__|_|_| |_|\___|_|   
	                                                                                                   
	- Plugin author: likeajumpingpro
	- Plugin name: Friend Notifier
	- Description: This default example plugin provides a notification in the chat when a player's friend joins the game.
	
]]

API = nil; --> When the plugins are loaded, this variable will be defined.
return function()
	local message = "Your friend %s has joined the game."; --> This is the message sent in the chat, the "%s" represents the player's name.
	API.friendJoined:Connect(function(player) --> This function will be called when the LocalPlayer's friend joins the game.
		API.systemMessage( --> Creates a system message that'll be displayed in the chat.
			string.format(message,player.Name), --> This will replace the "%s" with the player's name.
			"all" --> This is the name of the channel the message is sent in.
		);
	end)
end