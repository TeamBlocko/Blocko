--[[
	This module is essentially a remote wrapper. It simplifies code by creating a quicker way
	to manage remotes and bindables.
]]

--------------- Module: ---------------

local network = {
	eventsFolder = script.Parent:WaitForChild("events"),
	events = {}
};

--------------- Variables: ---------------

local isServer = game:GetService("RunService"):IsServer();
local isClient = not isServer;

--------------- Initialize: ---------------

for _,object in pairs(network.eventsFolder:GetChildren()) do
	if(object.ClassName:find("Event") or object.ClassName:find("Function")) then
		network.events[object.Name] = object;
	end
end

network.eventsFolder.ChildAdded:Connect(function(object)
	if(object.ClassName:find("Event")) then
		network.events[object.Name] = object;
	end
end)

local getEvent = function(name)
	return network.eventsFolder:WaitForChild(name);
end

--------------- Module functions: ---------------

function network:getEvent(name)
	return network.events[name];
end

function network:createRemoteEvent(name,callback)
	assert(isServer,"This method can only be called from the server.");
	assert(name ~= nil and type(name) == "string","Failed to pass string for remote event's name.");
	assert(not network.events[name] ~= nil,string.format("Name %q has been previously used for an event's name.",name));
	local event = Instance.new("RemoteEvent");
	event.Parent = network.eventsFolder;
	event.Name = name;
	if(callback ~= nil and type(callback) == "function") then
		event.OnServerEvent:Connect(callback);
	end
	network.events[name] = event;
	return event;
end

function network:bindRemoteEvent(name,callback)
	assert(name ~= nil and type(name) == "string","Failed to pass string for remote event's name.");
	assert(callback ~= nil and type(callback) == "function","Failed to pass function for remote event's callback.");
	assert(not getEvent(name) ~= nil,string.format("An event with the name %q does not exist.",name));
	if(isClient) then
		network.events[name].OnClientEvent:Connect(callback);
	else
		network.events[name].OnServerEvent:Connect(callback);
	end
end

function network:fireClients(...)
	network:fireClient(...);
end

function network:fireClient(name,clients,...)
	assert(isServer,"This method can only be called from the server.");
	assert(name ~= nil and type(name) == "string","Failed to pass string for remote event's name.");
	assert(not getEvent(name) ~= nil,string.format("An event with the name %q does not exist.",name));
	local event = getEvent(name);
	if(type(clients) == "table") then
		for _,client in pairs(clients) do
			event:FireClient(client,...)
		end
	elseif(type(clients) == "userdata") then
		event:FireClient(clients,...)
	end
end

function network:fireAllClients(name,...)
	assert(isServer,"This method can only be called from the server.");
	assert(name ~= nil and type(name) == "string","Failed to pass string for remote event's name.");
	assert(not getEvent(name) ~= nil,string.format("An event with the name %q does not exist.",name));
	getEvent(name):FireAllClients(...);
end

function network:fireServer(name,...)
	assert(isClient,"This method can only be called from the client.");
	assert(name ~= nil and type(name) == "string","Failed to pass string for remote event's name.");
	assert(not getEvent(name) ~= nil,string.format("An event with the name %q does not exist.",name));
	getEvent(name):FireServer(...);
end

function network:createRemoteFunction(name,callback)
	assert(isServer,"This method can only be called from the server.");
	assert(name ~= nil and type(name) == "string","Failed to pass string for remote event's name.");
	assert(not network.events[name] ~= nil,string.format("Name %q has been previously used for an event's name.",name));
	local event = Instance.new("RemoteFunction");
	event.Parent = network.eventsFolder;
	event.Name = name;
	if(callback ~= nil and type(callback) == "function") then
		event.OnServerInvoke = callback;
	end
	network.events[name] = event;
	
	return event;
end

function network:invokeServer(name,...)
	assert(isClient,"This method can only be called from the client.");
	assert(name ~= nil and type(name) == "string","Failed to pass string for remote function's name.");
	assert(not getEvent(name) ~= nil,string.format("An event with the name %q does not exist.",name));
	return getEvent(name):InvokeServer(...);
end

function network:createBindableEvent(name,callback)
	assert(name ~= nil and type(name) == "string","Failed to pass string for bindable event's name.");
	assert(callback ~= nil and type(callback) == "function","Failed to pass function for bindable event's callback.");
	local event = Instance.new("BindableEvent");
	event.Parent = network.EventsFolder;
	event.Name = name;
	event.Event:Connect(callback);
	network.events[name] = event;
end

function network:createBindableFunction(name,callback)
	assert(name ~= nil and type(name) == "string","Failed to pass string for bindable function's name.");
	assert(callback ~= nil and type(callback) == "function","Failed to pass function for bindable function's callback.");
	local event = Instance.new("BindableFunction");
	event.Parent = network.EventsFolder;
	event.Name = name;
	event.OnInvoke = callback;
	network.events[name] = event;
end

function network:invoke(name,...)
	assert(name ~= nil and type(name) == "string","Failed to pass string for bindable functions's name.");
	assert(not getEvent(name) ~= nil,string.format("An event with the name %q does not exist.",name));
    return getEvent(name):Invoke(...);
end

function network:fire(name,...)
	assert(name ~= nil and type(name) == "string","Failed to pass string for bindable event's name.");
	assert(not getEvent(name) ~= nil,string.format("An event with the name %q does not exist.",name));
	getEvent(name):Fire(...);
end

--------------- Readonly: ---------------

local proxy = {};
setmetatable(proxy,{
	__index = network,
	__newindex = function()
		warn("Attempt to modify a readonly table, this could result in failure of the network system.")
	end
})

--------------- Return: ---------------

return proxy;