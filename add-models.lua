
local base = "./assets/models/"
local worldPath = "./dist/WorldTemplate.rbxlx"

local models = {
	{ path = base .. "BlockTypes.rbxmx", parent = "ReplicatedStorage" },
	{ path = base .. "TemplateBlocks.rbxmx", parent = "Workspace" },
}

local place = remodel.readPlaceFile(worldPath)

for _, modelInfo in ipairs(models) do
	local model = remodel.readModelFile(modelInfo.path)
	print(modelInfo.path, modelInfo.parent)
	model.Parent = place[modelInfo.parent]
end

remodel.writePlaceFile(place, worldPath)
