--[[
	This module detects the current user's platform. This is used to provide a specified experience to them.
]]

return function()
	--------------- Variables: ---------------

	local pf = "Desktop";
	local uis = game:GetService("UserInputService");
	local guis = game:GetService("GuiService");
	
	--------------- Detection: ---------------

	if(uis.TouchEnabled) then 
		if(uis.GyroscopeEnabled or uis.AccelerometerEnabled) then  
			pf = "Mobile";
		end
	else
		if(guis:IsTenFootInterface()) then 
			pf = "Console";
		end
	end
	
	--------------- Return: ---------------

	return pf;
end