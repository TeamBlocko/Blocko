local modelsPath = "./assets/models/"
local worldPath = "./dist/WorldTemplate.rbxlx"

local game = remodel.readPlaceFile(worldPath)

for _, modelName in ipairs(remodel.readDir(modelsPath)) do
	local models = remodel.readModelFile(modelsPath .. modelName)
	print("--| " .. modelName)
	for _, model in ipairs(models) do
		print((" "):rep(6) .. model.Name)
		model.Parent = game:GetService(modelName:gsub("(.)%..+", "%1"))
	end
end

remodel.writePlaceFile(game, worldPath)
