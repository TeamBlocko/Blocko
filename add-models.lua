local args = { ... }
local isPacked = args[1] == "packed"

local modelsPath = "./assets/models/"
local worldPath = not isPacked and "./dist/WorldTemplate.rbxl" or "./dist/WorldTemplate.Packed.rbxl"

local game = remodel.readPlaceFile(worldPath)
local serverScriptService = game:GetService("ServerScriptService")

for _, modelName in ipairs(remodel.readDir(modelsPath)) do
	local models = remodel.readModelFile(modelsPath .. modelName)
	print("--| " .. modelName)
	for _, model in ipairs(models) do
		print((" "):rep(6) .. model.Name)
		local serviceName = modelName:gsub("(.)%..+", "%1")
		model.Parent = isPacked
			and game:GetService("ServerStorage"):FindFirstChild("Resources"):FindFirstChild(serviceName)
			or game:GetService(serviceName)
	end
end

if isPacked then
	local loaderResourcesScript = require 'addLoadScript'
	loaderResourcesScript.Parent = serverScriptService
end

if serverScriptService:FindFirstChild("TS") then
	remodel.setRawProperty(serverScriptService.TS.BetterChat.MainModule.Server.serverRunner, "Disabled", "Bool", true)	
else
	remodel.setRawProperty(game:GetService("ServerStorage").Resources.ServerScriptService.TS.BetterChat.MainModule.Server.serverRunner, "Disabled", "Bool", true)		
end

remodel.writePlaceFile(game, worldPath)
