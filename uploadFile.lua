local args = {...}
local asset_name = args[1]

function uploadPlace(filePath, placeId)
	local game = remodel.readPlaceFile(filePath)
	remodel.writeExistingPlaceAsset(game, placeId)
end

if asset_name == "hub" then
	uploadPlace("./dist/hub.rbxl", 5102036961)
elseif asset_name == "worldtemplate" then
	uploadPlace("./dist/WorldTemplate.Packed.rbxl", 5102195906)
elseif asset_name == "resource" then
	local game = remodel.readPlaceFile("./dist/WorldTemplate.Packed.rbxl")
	local serverStorage = game:GetService("ServerStorage")
	local resources = serverStorage:FindFirstChild("Resources")
	remodel.writeExistingModelAsset(resources, 5338127735)
else
	print("Invalid place name, hub, resource or worldtemplate")
end
