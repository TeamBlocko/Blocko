--[[
	This strips tags from a rich text string. (buggy)
]]

local parseXML = function(s) --> Forked from: http://lua-users.org/wiki/LuaXml
	local function parseargs(s)
		local arg = {}
		string.gsub(s,"([%-%w]+)=([\"'])(.-)%2",function (w,_,a)
			arg[w] = a
		end)
		return arg
	end
	
	local stack = {};
	local top = {};
	local detailed = {};
	table.insert(stack,top);
	local ni,c,label,xarg,empty;
	local i,j = 1,1;
	
	while true do
		ni,j,c,label,xarg,empty = string.find(s,"<(%/?)([%w:]+)(.-)(%/?)>",i);
		if not ni then break end
		local text = string.sub(s,i,ni-1);
		if(not string.find(text,"^%s*$")) then
			table.insert(top,text);
		end
		if(empty == "/") then
			table.insert(top,{
				label = label,
				xarg = parseargs(xarg),
				empty = 1
			});
			table.insert(detailed,{
				label = label,
				xarg = parseargs(xarg),
				empty = 1
			})
		elseif(c == "") then
			top = {
				label = label,
				xarg = parseargs(xarg)
			}
			table.insert(detailed,{
				label = label,
				xarg = parseargs(xarg)
			})
			table.insert(stack,top);
		else
			local toclose = table.remove(stack);
			top = stack[#stack];
			if(#stack < 1) then
				error("nothing to close with "..label);
			end
			if(toclose.label ~= label) then
				error("trying to close "..toclose.label.." with "..label);
			end
			if(top ~= nil) then
				table.insert(top,toclose);
			end
		end
		i = j + 1;
	end
			
	local text = string.sub(s,i);
	if(not string.find(text,"^%s*$")) then
		table.insert(stack[#stack],text);
	end
		
	local main = stack[1];
	local text = "";
	local tags = {};
	
	for _,v in pairs(main) do
		if(type(v) == "string") then
			text = text..v;
		elseif(v[1]) then
			if(type(v[1]) ~= "table") then
				text = text..v[1];
				tags[game:GetService("HttpService"):GenerateGUID()] = {
					content = v[1],
					class = v.label
				}
			else
				local t = v[1];
				repeat
					t = t[1];
				until type(t) ~= "table";
				if(t == nil) then
					t = "";
				end
				text = text .. t;
			end
		end
	end
	
	if(#main == 0) then
		text = s;
	end
		
	return text,tags,detailed;
end

return parseXML;