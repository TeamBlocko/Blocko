--[[
	Searches the string for an emoji format. Example being ":sunglasses:" 
]]

return function(query,symbol)
	--------------- Variables: ---------------

	local potentialEmojis = {};
	local wasClosed = {};
	local recording = false;
	local str = "";
	local space = string.char(32);
	local startPosition = 0;
	
	--------------- Setup: ---------------

	for i = 1,#query do
		if(query:sub(i,i) == symbol) then
			if(query:sub(i+1,i+1) ~= space) then
				recording = false;
			end
			if(string.len(str) > 1) then
				if(str:sub(#str,#str) ~= space) then
					table.insert(potentialEmojis,str);
					if(string.len(query:sub(startPosition,i)) > 2) then
						local primary = query:sub(startPosition,i):split(space)[1];
						local max = string.len(primary);
						if(primary:sub(1,1) == symbol) then
							if(max > 1) then
								if(primary:sub(max,max) == symbol) then
									table.insert(wasClosed,true);
								else
									table.insert(wasClosed,false);
								end
							end
						end
					end
				end
			end
			recording = not recording;
			str = "";
			startPosition = i;
		elseif(recording == true) then
			str = str..query:sub(i,i);
		end
	end
	if(str ~= "" and string.len(str) > 1 and str:find(space) == nil) then
		str = str:gsub(space,"");
		table.insert(potentialEmojis,str);
		table.insert(wasClosed,false);
	end
	
	--------------- Return: ---------------

	return potentialEmojis,wasClosed;
end