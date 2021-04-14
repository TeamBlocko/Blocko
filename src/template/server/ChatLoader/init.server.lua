local container = script.Parent.BetterChat;

require(container.MainModule)(
	require(script.Settings),
	container:WaitForChild("Plugins")
);