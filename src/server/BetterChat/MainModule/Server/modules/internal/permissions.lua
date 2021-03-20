--[[
	This module is used to get player permissions for the permissions configuration in the main settings module. This
	is used to add user tags and other stuff like that.
]]

return function(player)
	--------------- Variables: ---------------

	local configuration = shared.better_chat.configuration;
	local permissions = configuration.Permissions;
	local ranks = permissions.Ranks;
	local users = permissions.Users;
	local gamepasses = permissions.Gamepasses;
	local groups = permissions.Groups;
	local premium = permissions.RobloxPremium;
	
	--------------- Functions: ---------------

	local resolveToRankID = function(input)
		for _,rank in pairs(ranks) do
			if(type(input) == "number") then
				if(rank[1] == input) then
					return rank[1];
				end
			elseif(type(input) == "string") then
				if(rank[2] == input) then
					return rank[1];
				end
			end
		end
	end
	
	local ownsPass = function(userId,gamepassId)
		return game:GetService("MarketplaceService"):UserOwnsGamePassAsync(userId,gamepassId);
	end
	
	local isPremium = function()
		return player.MembershipType == Enum.MembershipType.Premium;
	end
	
	local groupRank = function(groupId)
		return player:GetRankInGroup(groupId);
	end
	
	local userRank = function()
		for user,permission in pairs(users) do
			if(player.Name == user or player.UserId == user) then
				return resolveToRankID(permission);
			end
		end
	end
	
	local resolveRank = function(rank,groupId)
		if(type(rank) == "string") then
			for _,v in pairs(game:GetService("GroupService"):GetGroupInfoAsync(groupId).Roles) do
				if(v.Name == rank) then
					return v.Rank;
				end
			end
		else
			return rank;
		end
	end
	
	local getHighest = function()
		local highest = 0;
		for _,rank in pairs(ranks) do
			if(rank[1] > highest) then
				highest = rank[1];
			end
		end
		return highest;
	end
	
	--------------- Setup: ---------------

	local userPermissions = {
		userRank() or 0,
		isPremium() and resolveToRankID(premium) or 0,
	}
		
	for groupId,group in pairs(groups) do
		for rank,permission in pairs(group) do
			if(groupRank(groupId) >= tonumber(resolveRank(rank,groupId))) then
				table.insert(userPermissions,resolveToRankID(permission));
			end
		end
	end
	
	for gamepassId,permission in pairs(gamepasses) do
		pcall(function()
			if(ownsPass(player.UserId,gamepassId)) then
				table.insert(userPermissions,resolveToRankID(permission));
			end
		end)
	end
	
	for k,v in pairs(userPermissions) do
		if(v == nil) then
			userPermissions[k] = nil;
		end
	end
	
	if(game.CreatorType == Enum.CreatorType.User) then
		if(player.UserId == game.CreatorId) then
			table.insert(userPermissions,getHighest());
		end
	elseif(game.CreatorType == Enum.CreatorType.Group) then
		if(game:GetService("GroupService"):GetGroupInfoAsync(game.CreatorId)["Owner"]["Id"] == player.UserId) then
			table.insert(userPermissions,getHighest());
		end
	end
	
	--------------- Sorting: ---------------

	table.sort(userPermissions,function(a,b)
		return a > b;
	end)
	
	--------------- Return: ---------------

	return userPermissions[1];
end