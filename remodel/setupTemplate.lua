local addModels = require("remodel/addModels")
local args = { ... }
local isPacked = args[1] == "packed"

local worldPath = not isPacked and "./dist/WorldTemplate.rbxl" or "./dist/WorldTemplate.Packed.rbxl"

local game = remodel.readPlaceFile(worldPath)
local serverStorage = game:GetService("ServerStorage")
local serverScriptService = game:GetService("ServerScriptService")
local replicatedStorage = game:GetService("ReplicatedStorage")
local playerScripts = game:GetService("StarterPlayer").StarterPlayerScripts

local services = {"ServerScriptService", "StarterPlayer", "ReplicatedStorage"}

function setUpResources()
	local resources = Instance.new("Folder")
	resources.Name = "Resources"

	for _, serviceName in ipairs(services) do
		local serviceFolder = Instance.new("Folder")
		serviceFolder.Name = serviceName
		serviceFolder.Parent = resources
	end

	local starterPlayerScripts = Instance.new("Folder")
	starterPlayerScripts.Name = "StarterPlayerScripts"
	starterPlayerScripts.Parent = resources:FindFirstChild("StarterPlayer")

	resources.Parent = serverStorage

	return resources
end

if isPacked then

	local resources = setUpResources()

	serverScriptService.TS.Parent = resources.ServerScriptService
	replicatedStorage.TS.Parent = resources.ReplicatedStorage
	playerScripts.TS.Parent = resources.StarterPlayer.StarterPlayerScripts

	local loaderResourcesScript = require("remodel/addLoadScript")
	loaderResourcesScript.Parent = serverScriptService
end

addModels(game, isPacked)

if serverScriptService:FindFirstChild("TS") then
	remodel.setRawProperty(serverScriptService.TS.BetterChat.MainModule.Server.serverRunner, "Disabled", "Bool", true)	
else
	remodel.setRawProperty(game:GetService("ServerStorage").Resources.ServerScriptService.TS.BetterChat.MainModule.Server.serverRunner, "Disabled", "Bool", true)		
end

remodel.writePlaceFile(game, worldPath)
