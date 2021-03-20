--[[
	This script ensures that the chat client is properly cloned to the player. The main reason for this is the
	loading time for the "MainModule" to get put in your game with the require() line.
]]

local localPlayer = game:GetService("Players").LocalPlayer;
local playerScripts = localPlayer.PlayerScripts;
local chatSystem = playerScripts:FindFirstChild("ChatClient");

if(chatSystem == nil) then
	local toInstall = game:GetService("StarterPlayer").StarterPlayerScripts:WaitForChild("ChatClient"):Clone();
	toInstall.Parent = localPlayer.PlayerScripts;
end

wait();
script:Destroy();