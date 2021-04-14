--[[
	This is a more efficient waiting system, as opposed to the built-in wait() function.
		CREDITS: https://devforum.roblox.com/t/custom-wait-the-best-solution-to-yielding/715274
]]

local heap = {}

function heap.insert(value, data)
	local insertPos = #heap + 1;
	heap[insertPos] = {
		value = value,
		data = data
	};

	local parentNode = heap[insertPos];
	local childNode = heap[math.floor(insertPos / 2)];
	while (insertPos > 1 and os.clock() - parentNode.data[2] - parentNode.value > os.clock() - childNode.data[2] - childNode.value) do
		local childPos = math.floor(insertPos / 2);
		heap[insertPos], heap[childPos] = heap[childPos], heap[insertPos];
		insertPos = math.floor(insertPos / 2);
	end
end

function heap.extract()
	local insertPos = 1;
	if (#heap < 2) then
		heap[1] = nil;
		return;
	end
	heap[1] = table.remove(heap);
	while (insertPos < #heap) do
		local childL, childR = heap[2 * insertPos], heap[2 * insertPos + 1];
		if (not childL or not childR) then
			break;
		end
		local smallerChild = 2 * insertPos + (os.clock() - childL.data[2] - childL.value < os.clock() - childR.data[2] - childR.value and 0 or 1);
		local child = heap[smallerChild];
		local parent = heap[insertPos];
		if (os.clock() - parent.data[2] - parent.value < os.clock() - child.data[2] - child.value) then
			heap[smallerChild], heap[insertPos] = parent, child;
		end
		insertPos = smallerChild;
	end
end

game:GetService("RunService").Stepped:Connect(function()
	local prioritizedThread = heap[1];
	while prioritizedThread do
		prioritizedThread = prioritizedThread.data;
		local yieldTime = os.clock() - prioritizedThread[2];
		if (prioritizedThread[3] - yieldTime <= 0) then
			heap.extract();
			coroutine.resume(prioritizedThread[1], yieldTime);
			prioritizedThread = heap[1];
		else
			prioritizedThread = nil;
		end
	end
end)

return function(Time)
	heap.insert(Time or 0, {
		coroutine.running(),
		os.clock(),
		Time or 0
	});
	return coroutine.yield(), os.clock();
end