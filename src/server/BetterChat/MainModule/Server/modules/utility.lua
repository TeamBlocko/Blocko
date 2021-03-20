--[[
	This module provides a simple rate limiting system that's used to prevent users from mass-spamming messages.
]]

--------------- Module: ---------------

local utility = {
	rateLimited = {},
	customWait = shared.better_chat.better_wait;
};

--------------- Functions: ---------------

function utility:createRateLimited(key,limit,inTime,originalCooldown)
	local tbl = {
		last = {},
		counts = 0,
		countdown = false,
		amountLimited = 0
	}
	
	function tbl:addEntry()
		if(tbl.counts + 1 <= limit) then
			tbl.counts += 1;
			table.insert(tbl.last,tick());
		else
			if(tick() - tbl.last[1] <= inTime and tbl.countdown == false) then
				tbl.countdown = true;
				coroutine.wrap(function()
					tbl.amountLimited += 1; 
					local cooldown = originalCooldown + math.clamp(tbl.amountLimited*5,0,originalCooldown/2);
					tbl.endsAt = tick() + (cooldown);
					utility.customWait(cooldown);
					tbl.counts = 0;
					tbl.last = {};
					tbl.countdown = false;
				end)();
			elseif(tick() - tbl.last[1] >= inTime) then
				tbl.counts = 1;
				tbl.last = {tick()};
				tbl.countdown = false;
				table.insert(tbl.last,tick());
			end
		end
	end
	
	function tbl:isLimited()
		return tbl.countdown;
	end
	
	function tbl:getLimit()
		if(tbl:isLimited()) then
			return math.floor(tbl.endsAt - tick());
		else
			return nil;
		end
	end
	
	utility.rateLimited[key] = tbl;
	return tbl;
end

--------------- Return: ---------------

return utility;