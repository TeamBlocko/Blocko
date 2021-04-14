--[[
	This module creates the billboard GUIs that house the chat bubbles.
]]

--------------- Module: ---------------

local module = {
	utility = require(script.Parent:WaitForChild("util")),
	richText = require(game:GetService("ReplicatedStorage"):WaitForChild("BetterChatShared"):WaitForChild("richText"));
};

--------------- Methods: ---------------

function module.create(parent,name,player)
	local localPlayer = game:GetService("Players").LocalPlayer;
	local stackModule = require(script:WaitForChild("stack")):createStack();
	local bubble = require(script:WaitForChild("chatBubble"));
	local owner = game:GetService("Players"):GetPlayerFromCharacter(parent.Parent);
	local isLocalPlayer = owner == localPlayer;
	
	local playerGui = game:GetService("Players").LocalPlayer.PlayerGui;
	local billboardGui = Instance.new("BillboardGui");
	local textSize = Instance.new("TextLabel");
	local holder = Instance.new("Frame");
	local constraint = Instance.new("UITextSizeConstraint");
	local container = playerGui:FindFirstChild("bubbleChat") or Instance.new("ScreenGui");
	
	container.Name = "bubbleChat";
	container.Parent = playerGui;
	container.ResetOnSpawn = false;
	
	billboardGui.Name = tostring(name);
	billboardGui.Parent = container;
	billboardGui.Adornee = parent;
	billboardGui.Active = true;
	billboardGui.Size = UDim2.new(5,0,5,0);
	billboardGui.LightInfluence = 0;
	billboardGui.StudsOffset = Vector3.new(0,isLocalPlayer and 3.5 or 4,isLocalPlayer and 2 or 0.1);
	billboardGui.ResetOnSpawn = false;
	billboardGui.MaxDistance = module.utility.maxTextDistance;
	
	holder.Name = "Container";
	holder.Parent = billboardGui;
	holder.BackgroundColor3 = Color3.fromRGB(255,255,255);
	holder.Size = UDim2.new(1,0,1,0);
	holder.BackgroundTransparency = 1;
		
	local tbl = {};
	tbl.ui = billboardGui;
	tbl.stack = stackModule;
		
	tbl.chatBubble = bubble(unpack({
		billboardGui,
		module.utility,
		stackModule,
		module.richText,
		player
	}));
	
	return tbl;
end

--------------- Return: ---------------

return module;