local function deepCopyTable(t)
	local copy = {}
	for key, value in pairs(t) do
		if type(value) == "table" then
			copy[key] = deepCopyTable(value)
		else
			copy[key] = value
		end
	end
	return copy
end

function reconcileTable(target, template)
	for k, v in pairs(template) do
		if type(k) == "string" then
			if target[k] == nil then
				if type(v) == "table" then
					target[k] = deepCopyTable(v)
				else
					target[k] = v
				end
			elseif type(target[k]) == "table" and type(v) == "table" then
				reconcileTable(target[k], v)
			end
		end
	end
	return target
end

return reconcileTable
