--[[
	This is a basic utility module that currently only provides the name color in chat.
]]

--------------- Module: ---------------

local utility = {};

--------------- Module functions: ---------------

function utility:getNameColor(messageObject)
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
	
	if(messageObject.isPlayer ~= nil) then
		local player = messageObject.player;
		if(player) then
			if(player.Team ~= nil) then
				return player.TeamColor.Color;
			end
		end
	end
	
	if(messageObject.options ~= nil) then
		if(messageObject.options.nameColor ~= nil) then
			if(messageObject.isPlayer and messageObject.player) then
				if(messageObject.usingDisplayName) then
					return messageObject.player:GetAttribute("DisplayNameColor");
				else
					return messageObject.player:GetAttribute("NameColor");
				end
			else
				return messageObject.options.nameColor;
			end
		end
	end

	return computeNameColor(messageObject.fromSpeaker);
end

--------------- Return: ---------------

return utility;