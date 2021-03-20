--[[
	RichText (https://developer.roblox.com/en-us/articles/gui-rich-text) is a semi-complicated system. This
	module will speed up the process of handling it for user-input / similar.
]]

--------------- Module: ---------------

local richText = {
	brickColors = require(script:WaitForChild("brickColors"));
	XML = require(script:WaitForChild("XML"))
};

--------------- Methods: ---------------

function richText.escape_rich(text)
	return text:gsub(".",{["<"] = "&lt;",[">"] = "&gt;",["\""] = "&quot;",["'"] = "&apos;",["&"] = "&amp;"});
end

function richText.escape_regular(text)
	return text:gsub(".",{["^"] = "%^";["$"] = "%$";["("] = "%(";[")"] = "%)";["%"] = "%%";["."] = "%.";["["] = "%[";["]"] = "%]";["*"] = "%*";["+"] = "%+";["-"] = "%-";["?"] = "%?";});
end

function richText.rgbToHex(rgb) --> thank you github <3
	rgb = {
		rgb.R * 255,
		rgb.G * 255,
		rgb.B * 255
	}
	
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

function richText.hexToRgb(hex)
	hex = hex:gsub("#","");
	local r = tonumber("0x"..hex:sub(1,2));
	local g = tonumber("0x"..hex:sub(3,4));
	local b = tonumber("0x"..hex:sub(5,6));
	return Color3.fromRGB(r,g,b);
end

function richText.unescape(text)
	local removeFormat = {
		["&lt;"] = "<",
		["&gt;"] = ">",
		["&quot;"] = "\"",
		["&apos;"] = "'",
		["&amp;"] = "&"
	}
	for k,v in pairs(removeFormat) do
		text = text:gsub(k,v);
	end
	return text;
end

function richText.stripTags(text)
	return richText.unescape(richText.XML(text));
end

function richText.markdown_format(text)
	text = richText.escape_rich(text);
	local colorTable = {};
	local endedAt = {};
	local startedAt = {};
	local open = false;
	
	-- terrible methods below: (close ur eyes k thx)
	
	local customMatchAndReplace = function(s,pattern,replace)
		local original = s;
		local matches = {};
		while(true) do
			local startPosition,endPosition = s:find(pattern);
			if(startPosition ~= nil) then
				table.insert(matches,s:sub(startPosition,endPosition));
				s = s:sub(endPosition + 1,string.len(s));
			else
				break;
			end
		end
		s = original;
		for _,v in pairs(matches) do
			if not (v:find("<") or v:find(">")) then
				s = s:gsub(richText.escape_regular(v),replace(v));
			end
		end
		return s;
	end
	
	-- pattern god right here, mhm yep i am pattern god :sunglasses:
	
	text = customMatchAndReplace(text,"*%*%*(.-)*%*%*",function(s)
		return "<i><b>"..s:gsub("***","").."</b></i>";
	end)
	
	text = customMatchAndReplace(text,"*%*(.-)*%*",function(s)
		return "<b>"..s:gsub("**","").."</b>";
	end)
	
	text = customMatchAndReplace(text,"%*(.-)%*",function(s)
		return "<i>"..s:gsub("*","").."</i>";
	end)
	
	text = customMatchAndReplace(text,"~%~(.-)~%~",function(s)
		return "<s>"..s:gsub("~~","").."</s>";
	end)
	
	text = customMatchAndReplace(text,"_%_(.-)_%_",function(s)
		return "<u>"..s:gsub("__","").."</u>";
	end)
	
	text = customMatchAndReplace(text,"%_(.-)%_",function(s)
		return "<i>"..s:gsub("_","").."</i>";
	end)
		
	local e = richText.escape_regular;
	for colorTag in text:gmatch(e("(")..".-"..e(")")) do
		if(colorTag:find("/")) then
			local startPos = colorTag:find("/");
			local colorValue = colorTag:sub(2,startPos-1);
			local insideText = colorTag:sub(startPos+1,string.len(colorTag)-1);
			local defaultColor = Color3.fromRGB(0,0,0);
			if(colorValue:sub(string.len(colorValue),string.len(colorValue)) == string.char(32)) then
				colorValue = colorValue:sub(1,string.len(colorValue)-1);
			end
			if(insideText:sub(1,1) == string.char(32)) then
				insideText = insideText:sub(2,string.len(insideText));
			end
			if(string.len(colorValue) > 0) then
				local noSpaces = colorValue:gsub(string.char(32),"");
				if(noSpaces:sub(1,1) == "#" and string.len(noSpaces) == 7) then
					defaultColor = richText.hexToRgb(noSpaces);
				elseif(colorValue:find(",") and #colorValue:split(",") == 3) then
					local rgb = {};
					for _,num in pairs(colorValue:split(",")) do
						local number;
						pcall(function()
							number = tonumber(num);
						end)
						table.insert(rgb,number or 255);
					end
					defaultColor = Color3.fromRGB(unpack(rgb));
				else
					for color,value in pairs(richText.brickColors) do
						if(color:sub(1,string.len(colorValue)):lower() == colorValue:lower()) then
							defaultColor = value;
						end
					end
				end
			end
			if(string.len(insideText) >= 1) then
				text = text:gsub(richText.escape_regular(colorTag),string.format("<font color=\"%s\">%s</font>",richText.rgbToHex(defaultColor),insideText));
			end
		end
	end
	
	return text;
end

--------------- Return: ---------------

return richText;