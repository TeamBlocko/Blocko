
local modelsPath = "./assets/models/"

return function(game, isPacked)
	local serverStorage = game:GetService("ServerStorage")

	for _, modelName in ipairs(remodel.readDir(modelsPath)) do
		local models = remodel.readModelFile(modelsPath .. modelName)
		print("--| " .. modelName)
		for _, model in ipairs(models) do
			print((" "):rep(6) .. model.Name)
			local serviceName = modelName:gsub("(.)%..+", "%1")
			model.Parent = isPacked
				and serverStorage:FindFirstChild("Resources"):FindFirstChild(serviceName)
				or game:GetService(serviceName)
		end
	end
end