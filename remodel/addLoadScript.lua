local LOADER_MODULE_SOURCE =
[[
local InsertService = game:GetService("InsertService")
local loader = {}

loader.getVersion = function(id)
	return InsertService:GetLatestAssetVersionAsync(id)
end

loader.loadVersion = function(vId)
	return InsertService:LoadAssetVersion(vId)
end

loader.getLatest = function(id)
	local loaded, vId
	local success, err = pcall(function()
		vId = loader.getVersion(id)
		loaded = loader.loadVersion(vId)
	end)
	if not success then
		print("Failed to load module "..id..": "..tostring(err))
		loaded, vId = loader.getLatest(id)
	end
	return loaded, vId
end

return loader
]]

local LOAD_RESOURCES_SOURCE =
[[
local runService = game:GetService("RunService")

local loader = require(script.Loader)
local resources = runService:IsStudio() and game.ServerStorage:FindFirstChild("Resources") or
		loader.getLatest(5338127735):GetChildren()[1]

local function loadAssets(folder, path)
	path = path or game
	for _, child in ipairs(folder:GetChildren()) do
		print(child)
		local _path = path:FindFirstChild(child.Name)
		if _path and _path:IsA("Folder") then
			_path:Destroy()
			child.Parent = path
			continue
		end
		if _path and not _path:IsA("Folder") then
			loadAssets(child, _path)
			continue
		end
		if not _path then
			child.Parent = path
		end
	end
end

loadAssets(resources)
]]

local loadResourcesScript = Instance.new("Script")
loadResourcesScript.Name = "LoadResources"
remodel.setRawProperty(loadResourcesScript, "Source", "String", LOAD_RESOURCES_SOURCE)

local loaderModule = Instance.new("ModuleScript")
loaderModule.Name = "Loader"
remodel.setRawProperty(loaderModule, "Source", "String", LOADER_MODULE_SOURCE)
loaderModule.Parent = loadResourcesScript

return loadResourcesScript
