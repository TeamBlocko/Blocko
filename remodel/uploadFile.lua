local args = {...}
local asset_name = args[1]

function uploadPlace(filePath, placeId)
	local game = remodel.readPlaceFile(filePath)
	remodel.writeExistingPlaceAsset(game, placeId)
end

local technlogies = {
	"Compatibility", "Future", "ShadowMap", "Voxel",
}

local template_places = {
	Compatibility=5102195906,
	Voxel=7195338159,
	ShadowMap=7195431613,
	Future=7195436456,
}

if asset_name == "hub" then
	uploadPlace("./dist/hub.rbxl", 5102036961)
elseif asset_name == "worldtemplate" then
	local game = remodel.readPlaceFile("./dist/WorldTemplate.Packed.rbxl")
	local lighting = game:GetService("Lighting")
	for _, technology in ipairs(technlogies) do
		local placeId = template_places[technology]
		print(lighting, technology, Enum.Technology[technology])
		remodel.setRawProperty(lighting, "Technology", "Enum", Enum.Technology[technology])
		remodel.writeExistingPlaceAsset(game, placeId)
		print("Published", remodel.getRawProperty(lighting, "Technology"), placeId)
		print(string.rep("-", 10))
	end
elseif asset_name == "resource" then
	local game = remodel.readPlaceFile("./dist/WorldTemplate.Packed.rbxl")
	local serverStorage = game:GetService("ServerStorage")
	local resources = serverStorage:FindFirstChild("Resources")
	remodel.writeExistingModelAsset(resources, 5338127735)
else
	print("Invalid asset. Expected hub, resource or worldtemplate")
end
