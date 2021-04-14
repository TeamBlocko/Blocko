--[[
	This module will handle some basic essential functions such as message filtering and message creation.
]]

--------------- Module: ---------------

local chatSystem = {
	network = shared.better_chat.network,
	speaker = shared.better_chat.speaker,
	channel = require(script:WaitForChild("channel")),
	permissions = require(script.Parent:WaitForChild("internal"):WaitForChild("permissions")),
	cache = {}
};


--------------- Variables: ---------------

local configuration = shared.better_chat.configuration;
shared.better_chat.chatSystem = chatSystem;

--------------- Functions: ---------------

local resolveToRankID = function(input)
	for _,rank in pairs(configuration.Permissions.Ranks) do
		if(type(input) == "number") then
			if(rank[1] == input) then
				return rank[1];
			end
		elseif(type(input) == "string") then
			if(rank[2] == input) then
				return rank[1];
			end
		end
	end
end

local isUser = function(tag,player)
	if(tag.Users ~= nil) then
		if(table.find(tag.Users,player.Name)) then
			return true;
		elseif(table.find(tag.Users,player.UserId)) then
			return true;
		else
			return false;
		end
	else
		return false;
	end
end

local getTags = function(player)
	if(player ~= nil) then
		local options = {};
		local playerRank = chatSystem.fetchPermissions(player);
		for _,tag in pairs(chatSystem.speaker:getSpeaker(player.Name).tags) do
			table.insert(options,tag);
		end
		for _,tag in pairs(configuration.ChatTags) do
			if(resolveToRankID(tag.PermissionRank) == playerRank or isUser(tag,player)) then
				table.insert(options,{
					Color = tag.Color,
					Icon = tag.Icon,
					Text = tag.Name or tag.Text
				});
			end
		end
		return options;
	else
		return {};
	end
end

local getOptions = function(player,checkAttributes)
	if(player ~= nil) then
		local options = {};
		local playerRank = chatSystem.fetchPermissions(player);
		
		for _,config in pairs(configuration.ChatColors) do
			if(resolveToRankID(config.PermissionRank) == playerRank or isUser(config,player)) then
				options.textColor = config.ChatColor;
				options.nameColor = config.NameColor;
				options.displayNameColor = config.DisplayNameColor or chatSystem:getNameColor(player,true);
			end
		end
		
		if(checkAttributes) then
			if(options.textColor ~= player:GetAttribute("TextColor")) then
				options.textColor = player:GetAttribute("TextColor");
			end
			if(configuration.ChatSettings.Client.DisplayNames.PlayerDisplayNamesEnabled) then
				if(options.nameColor ~= player:GetAttribute("DisplayNameColor")) then
					options.nameColor = player:GetAttribute("NameColor");
					options.displayNameColor = player:GetAttribute("DisplayNameColor");
				end
			else
				if(options.nameColor ~= player:GetAttribute("NameColor")) then
					options.nameColor = player:GetAttribute("NameColor");
				end
			end
		end
		
		return options;
	else
		return {};
	end
end

local shallowCopy = function(original)
	local copy = {};
	for key,value in pairs(original) do
		copy[key] = value;
	end
	return copy;
end

--------------- Module: ---------------

function chatSystem.fetchPermissions(player)
	return chatSystem.cache[player] or chatSystem.permissions(player);
end

function chatSystem:getNameColor(player,use)
	local name_colors = {
		Color3.fromRGB(253,41,67),
		Color3.fromRGB(1,162,255),
		Color3.fromRGB(1,236,111),
		Color3.fromRGB(174,81,202),
		Color3.fromRGB(255,154,76),
		Color3.fromRGB(255,211,50),
		Color3.fromRGB(255,205,221),
		Color3.fromRGB(255,234,183)
	};

	local function getValue(pName)
		local value = 0
		for index = 1,#pName do
			local cValue = string.byte(string.sub(pName,index,index));
			local reverseIndex = #pName - index + 1;
			if(#pName%2 == 1) then
				reverseIndex = reverseIndex - 1;
			end
			if(reverseIndex%4 >= 2) then
				cValue = -cValue;
			end
			value = value + cValue;
		end
		return value;
	end

	local color_offset = 0;
	local function computeNameColor(pName)
		return name_colors[((getValue(pName) + color_offset) % #name_colors) + 1];
	end

	if(player) then
		if(player.Team ~= nil) then
			return player.TeamColor.Color;
		end
	end
	
	return computeNameColor(configuration.ChatSettings.Client.DisplayNames.PlayerDisplayNamesEnabled and use and player.DisplayName or player.Name);
end

function chatSystem:getOptions(player,...)
	return getOptions(player,...)
end

function chatSystem:filter(from,message)
	--[[
	
		--------------- WARNING: ---------------
		
		REMOVING THIS WILL RESULT IN YOUR GAME BEING SUBJECT TO MODERATION.
		THIS FUNCTION FILTERS ALL MESSAGES SENT BY USERS.
		DO NOT REMOVE THIS UNDER ANY CIRCUMSTANCE AT ALL.
		
	]]
	
	if(from == nil) then
		return message;
	else
		local filterResult;
		local success,errorMessage = pcall(function()
			filterResult = game:GetService("TextService"):FilterStringAsync(message,from.UserId);
		end)
		if(not success and errorMessage) then
			warn("[BETTER CHAT]: A filtering error has occured:",errorMessage);
		end
		return filterResult or (success == false and string.rep("_",string.len(message)));
	end
end

function chatSystem:createMessageObject(speakerName,messageContent,channel,player,messageType)
	assert(speakerName ~= nil and type(speakerName) == "string","Failed to pass \"string\" for \"speakerName\"");
	local speaker = chatSystem.speaker:getSpeaker(speakerName);
	if(speaker ~= nil) then
		if(chatSystem.channel:getChannel(channel) ~= nil) then
			if(chatSystem.channel:getChannel(channel):isSpeakerInChannel(speaker) == true) then			
				coroutine.wrap(function()
					if(player) then
						chatSystem.cache[player] = chatSystem.permissions(player);
					end
				end)();
				
				local object;
				object = {
					ID = game:GetService("HttpService"):GenerateGUID(),
					fromSpeaker = speakerName,
					content = nil,
					isFiltered = false,
					channel = channel,
					isPlayer = player ~= nil,
					player = player,
					messageLength = string.len(messageContent),
					messageType = messageType,
					chatTags = getTags(player),
					options = getOptions(player,true),
					fromSpeakerId = player ~= nil and player.UserId or nil,
					isTeamMessage = false,
					unfilteredMessage = messageContent,
					filter = function()
						object.unfilteredMessage = nil;
						object.initialize = nil;
						object.filterResult = chatSystem:filter(speaker:getPlayer(),messageContent);
						object.isFiltered = true;
					end
				}
				
				local processObject = shallowCopy(object);
				processObject.filter = nil;
				processObject.message = messageContent;
				speaker:getEvents()[1]:Fire(processObject);
				
				for _,func in pairs(shared.better_chat.functions.processFunctions) do
					local result = func(processObject);
					if(type(result[1]) == "boolean") then
						if(result[1]) then
							return false,result[2];
						end
					else
						warn("Expected type: \"boolean\" for return on message process.");
					end
				end
				
				return true,object;
			else
				return false,"You do not have access to this channel.";
			end
		else
			return false,"Invalid channel.";
		end
	else
		warn(string.format("Speaker %q does not exist.",speakerName));
		return false,"Invalid speaker.";
	end
end

--------------- Return: ---------------

return chatSystem;