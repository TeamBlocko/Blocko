local args = {...}
local place_name = args[1]

function uploadPlace(filePath, placeId)
	local game = remodel.readPlaceFile(filePath)
	remodel.writeExistingPlaceAsset(game, placeId)
end

if place_name == "hub" then
	uploadPlace("./dist/hub.rbxl", 5102036961)
elseif place_name == "worldtemplate" then
	uploadPlace("./dist/WorldTemplate.Packed.rbxl", 5102195906)
else
	print("Invalid place name, hub or worldtemplate")
end
