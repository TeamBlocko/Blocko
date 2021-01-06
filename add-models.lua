local args = { ... }
local isPacked = args[1] == "packed"

local modelsPath = "./assets/models/"
local worldPath = not isPacked and "./dist/WorldTemplate.rbxlx" or "./dist/WorldTemplate.Packed.rbxlx"

local game = remodel.readPlaceFile(worldPath)

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
	loaderResourcesScript.Parent = game:GetService("ServerScriptService")
end

remodel.writePlaceFile(game, worldPath)
