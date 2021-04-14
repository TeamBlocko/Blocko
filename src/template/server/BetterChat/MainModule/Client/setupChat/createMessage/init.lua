--[[
	This module creates all of the messages. The message creators can be found in modules > messageCreators.
]]

return function(chat,configuration,network,serverConfig,richText,detectPlatform,mouse,initializeWhisper,initializeTeam,wholeConfig)
	--------------- Variables: ---------------
		
	shared.better_chat.clientConfig = configuration;
	shared.better_chat.serverConfig = serverConfig;
	shared.better_chat.wholeConfig = wholeConfig;
	
	local modules = script.Parent.Parent:WaitForChild("modules");
	local messageUtility = require(script:WaitForChild("messageUtility"));
	local platform = detectPlatform();
	local commands = modules:WaitForChild("commands");
	local font = configuration.DefaultFont;
	local messageCache = {};
	local cachedInformation = {};
	local muted = {};
	local messageCount = 0;
	local moduleHandlers = {
		["/console"] = "developerConsole",
		["/e"] = "playEmote",
		["/ignore"] = "mute",
		["/mute"] = "mute",
		["/unignore"] = "unmute",
		["/unmute"] = "unmute",
		["/?"] = "help",
		["/help"] = "help"
	};

	--------------- Functions: ---------------

	local getObjectFromMessage = function(object)
		if(messageCache[object.ID] ~= nil) then
			return messageCache[object.ID];
		end
		messageCount += 1;
		local extra = {false,detectPlatform()};
		if(object.messageType == "whisper") then
			object.messageType = "default";
			extra[1] = true;
		end
		
		local messageModule = require(modules:WaitForChild("messageCreators"):WaitForChild(object.messageType));
		local cached = messageModule(chat,object,messageUtility,richText,font,initializeWhisper,configuration.TextStroke,unpack(extra));
		messageCache[object.ID] = cached;
		cachedInformation[cached.ui] = cached;
		cached.destroyInternalConnections = function()
			messageCache[object.ID] = nil;
			cachedInformation[cached.ui] = nil;
		end
		return cached;
	end
	
	local getObjectFromUI = function(uiObject)
		return cachedInformation[uiObject];
	end
	
	local onCreate = function(object)
		if(not muted[object.fromSpeaker]) then
			local chatObject = getObjectFromMessage(object);
			if(platform == "Desktop") then
				shared.better_chat.connectionsList.MessagesChanged:Fire(messageCount);
			end
			chatObject:updateText(object);
		end
	end
	
	local onFilter = function(object)
		if(not muted[object.fromSpeaker]) then
			local chatObject = getObjectFromMessage(object);
			if(platform == "Desktop") then
				shared.better_chat.connectionsList.MessagesChanged:Fire(messageCount);
			end
			chatObject:updateText(object);
		end
	end
	
	local systemMessage = function(message,channel,name)
		name = name or "";
		onCreate({
			ID = game:GetService("HttpService"):GenerateGUID(),
			channel = channel,
			fromSpeaker = name,
			isFiltered = true,
			isPlayer = false,
			messageLength = string.len(message),
			messageType = "default",
			player = nil,
			message = message,
			options = {
				nameColor = Color3.fromRGB(200,200,200),
				textColor = Color3.fromRGB(255,255,255)
			}
		});
	end
	
	--------------- Shared methods: ---------------

	shared.better_chat.messageCreators = {
		onCreate = onCreate,
		onFilter = onFilter,
		systemMessage = systemMessage,
		getObjectFromUI = getObjectFromUI
	}
	
	shared.better_chat.muteSpeaker = function(speakerName)
		if(speakerName ~= game:GetService("Players").LocalPlayer.Name) then
			speakerName = speakerName:sub(1,20);
			if(network:invokeServer("isSpeaker",speakerName) ~= nil) then
				systemMessage(string.format("Speaker %q has been muted.",speakerName),"all");
				muted[speakerName] = true;
			else
				systemMessage(string.format("Invalid speaker %q.",speakerName),"all");
			end
		else
			systemMessage("You cannot mute yourself.","all");
		end
	end
	
	shared.better_chat.unmuteSpeaker = function(speakerName)
		if(speakerName ~= game:GetService("Players").LocalPlayer.Name) then
			speakerName = speakerName:sub(1,20);
			if(network:invokeServer("isSpeaker",speakerName) ~= nil) then
				if(muted[speakerName]) then
					systemMessage(string.format("Speaker %q has been unmuted.",speakerName),"all");
					muted[speakerName] = nil;
				else
					systemMessage(string.format("Speaker %q is not muted.",speakerName),"all");
				end
			else
				systemMessage(string.format("Invalid speaker %q.",speakerName),"all");
			end
		else
			systemMessage("You cannot unmute yourself.","all");
		end
	end
	
	--------------- Connections: ---------------
	
	network:bindRemoteEvent("onMessageCreated",onCreate);
	network:bindRemoteEvent("onMessageFiltered",onFilter);
	network:bindRemoteEvent("handleClientCommand",function(message)
		for command,module in pairs(moduleHandlers) do
			if(message:sub(1,string.len(command)):lower() == command:lower()) then
				if(commands:FindFirstChild(module) ~= nil) then
					require(commands:FindFirstChild(module))(message);
				else
					warn("[BETTER CHAT]: There is no module to handle command:",message);
				end
			end
		end
	end)
end