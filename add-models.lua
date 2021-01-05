local loaderResourcesScript = require 'addLoadScript'

local modelsPath = "./assets/models/"
local worldPath = "./dist/WorldTemplate.rbxlx"

local game = remodel.readPlaceFile(worldPath)
local args = { ... }

for _, modelName in ipairs(remodel.readDir(modelsPath)) do
	local models = remodel.readModelFile(modelsPath .. modelName)
	print("--| " .. modelName)
	for _, model in ipairs(models) do
		print((" "):rep(6) .. model.Name)
		local serviceName = modelName:gsub("(.)%..+", "%1")
		model.Parent = args[1] == "packed"
			and game:GetService("ServerStorage"):FindFirstChild("Resources"):FindFirstChild(serviceName)
			or game:GetService(serviceName)
	end
end

loaderResourcesScript.Parent = game:GetService("ServerScriptService")

remodel.writePlaceFile(game, worldPath)
