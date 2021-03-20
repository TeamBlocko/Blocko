--[[
	Roblox's default .MouseEnter and .MouseLeave system isn't very accurate at times. This
	module is a less efficient but more accurate method.
]]

--------------- Variables: ---------------

local module = {};
local mouse = game:GetService("Players").LocalPlayer:GetMouse();
local playerGui = game:GetService("Players").LocalPlayer:WaitForChild("PlayerGui");

--------------- Functions: ---------------

local function toDictionary(tbl)
	local new = {};
	for _,object in pairs(tbl) do
		new[object] = object;
	end
	return new;
end

--------------- Module functions: ---------------

function module.mouseEnter(object,callback)
	coroutine.wrap(function()
		local history = {};
		local connection;
		connection = game:GetService("RunService").RenderStepped:Connect(function()
			if(object:GetFullName() == object.Name) then
				connection:Disconnect();
			end
			local objects = toDictionary(playerGui:GetGuiObjectsAtPosition(mouse.X,mouse.Y));
			if(objects[object] ~= nil) then
				if(history[object] == nil) then
					pcall(function()
						callback();
					end)
				end
			end
			history = objects;
		end)
	end)();
end

function module.mouseLeave(object,callback)
	coroutine.wrap(function()
		local history = {};
		local connection;
		connection = game:GetService("RunService").RenderStepped:Connect(function()
			if(object:GetFullName() == object.Name) then
				connection:Disconnect();
			end
			local objects = toDictionary(playerGui:GetGuiObjectsAtPosition(mouse.X,mouse.Y));
			if(objects[object] == nil) then
				if(history[object] ~= nil) then
					pcall(function()
						callback();
					end)
				end
			end
			history = objects;
		end)
	end)();
end

function module.onClick(object,callback)
	local allowed = false;
	module.combination(object,function(bool)
		allowed = bool;
	end)
	local connection;
	connection = game:GetService("UserInputService").InputBegan:Connect(function(input)
		if(input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseButton1) then
			if(allowed) then
				callback();
			end
		end
	end)
	object.Changed:Connect(function()
		if(object:GetFullName() == object.Name) then
			connection:Disconnect();
		end
	end)
end

function module.combination(object,callback)
	local updateState = function(boolean)
		callback(boolean);
	end
	module.mouseEnter(object,function()updateState(true);end)
	module.mouseLeave(object,function()updateState(false);end)
end

--------------- Return: ---------------

return module;