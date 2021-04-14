--[[
	This module provides quick functions for the webhook library.
]]

--------------- Module: ---------------

local util = {};

--------------- Methods: ---------------

function util.rgbToHex(rgb) --> thank you github <3
	rgb = {rgb.R * 255,rgb.G * 255,rgb.B * 255};
	local hexadecimal = "#";
	for key,value in pairs(rgb) do
		local hex = '';
		while(value > 0)do
			local index = math.fmod(value, 16) + 1;
			value = math.floor(value / 16);
			hex = string.sub('0123456789ABCDEF',index,index)..hex;	
		end
		if(string.len(hex) == 0)then
			hex = '00';
		elseif(string.len(hex) == 1)then
			hex = '0'..hex;
		end
		hexadecimal = hexadecimal..hex;
	end
	return hexadecimal;
end

function util.hexToRgb(hex)
	hex = hex:gsub("#","");
	local r = tonumber("0x"..hex:sub(1,2));
	local g = tonumber("0x"..hex:sub(3,4));
	local b = tonumber("0x"..hex:sub(5,6));
	return Color3.fromRGB(r,g,b);
end

-- ISO8601 PARSING CREDITS: rogchamp / https://www.roblox.com/users/17828104/profile

function util:getIso8601(date)
	local function format(num, digits)
		return string.format("%0"..digits.."i", num);
	end
	
	local osDate = os.date("!*t",date or os.time());
	local year, mon, day = osDate["year"], osDate["month"], osDate["day"];
	local hour, min, sec = osDate["hour"], osDate["min"], osDate["sec"];
	return year.."-"..format(mon, 2).."-"..format(day, 2).."T"..format(hour, 2)..":"..format(min, 2)..":"..format(sec, 2).."Z";
end

--------------- Return: ---------------

return util;