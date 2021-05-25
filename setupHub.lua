local addModels = require("addModels")

local worldPath = "./dist/hub.rbxl"

local game = remodel.readPlaceFile(worldPath)

addModels(game)

remodel.writePlaceFile(game, worldPath)