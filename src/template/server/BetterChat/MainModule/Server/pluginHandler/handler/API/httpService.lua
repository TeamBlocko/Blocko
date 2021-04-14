--[[
	This module is a http-service wrapper for people who want to create easy-to-use plugins. The module requires
	no built-in better-chat features. This means you can use this module for your own work if needed.
]]

--------------- Module: ---------------

local module = {};
local cacheTbl = {};

--------------- Variables: ---------------

local httpService = game:GetService("HttpService");

--------------- Methods: ---------------

function module:jsonEncode(details)
	if(details) then
		return true,httpService:JSONEncode(details);
	else
		return false,"[HTTP SERVICE]: Failed to pass argument for \":jsonEncode\".";
	end
end

function module:jsonDecode(details)
	local data;
	local decode = function()
		data = httpService:JSONDecode(details);
	end
	local success,errorMessage = pcall(decode);
	if(success) then
		return true,data;
	else
		local message = "[HTTP SERVICE]: An unknown error has occured: " .. tostring(errorMessage);
		warn(message);
		return false,errorMessage;
	end
end

function module:requestAsync(tbl)
	if(type(tbl) == "table") then
		if(tbl.url ~= nil and type(tbl.url) == "string") then
			if(tbl.method == nil) then
				tbl.method = "GET";
			end
			
			local headers = {};
			local body;
			local data;

			if(tbl.headers ~= nil) then
				if(type(tbl.headers) == "table") then
					headers = tbl.headers;
				else
					local message = "[HTTP SERVICE]: Expected type \"table\" for the \"headers\" key.";
					warn(message);
					return false,message;
				end
			end

			if(tbl.body ~= nil) then
				if(type(tbl.body) == "string") then
					body = tbl.body;
				else
					local message = "[HTTP SERVICE]: Expected type \"string\" for the \"body\" field.";
					warn(message);
					return false,message;
				end
			end

			local requestAsync = function()
				local fields = {
					Url = tbl.url,
					Method = tbl.method;
					Headers = headers;
				}
				if(body ~= nil) then
					fields.Body = body;
				end

				local response = httpService:RequestAsync(fields);
				data = response;
			end

			local success,errorMessage = pcall(requestAsync);
			if(success) then
				if(data) then
					return true,data;
				else
					local message = "[HTTP SERVICE]: Response data not found?";
					warn(message);
					return false,message;
				end
			else
				local message = "[HTTP SERVICE]: An unknown error has occured: " .. tostring(errorMessage);
				warn(message);
				return false,message;
			end
		else
			local message = "[HTTP SERVICE]: Expected type \"string\" for the \"url\" key.";
			warn(message);
			return false,message;
		end
	else
		local message = "[HTTP SERVICE]: Expected type \"table\" for :getAsync";
		warn(message);
		return false,message;
	end
end

function module:postAsync(...)
	local tuple = {...};
	local response;
	local success,err = pcall(function()
		response = game:GetService("HttpService"):PostAsync(unpack(tuple));
	end)
	if(success) then
		return success,response;
	else
		warn("[HTTP SERVICE]: Unexpected :postAsync error, ",err);
		return false,err;
	end
end

function module:getAsync(url,cache,headers)
	if(cache and cacheTbl[url] == nil or not cache) then
		local details = {
			url = url,
			method = "GET",
		};
		
		if(headers) then
			details.headers = headers;
		end
		
		local success,response = module:requestAsync(details);
		if(success) then
			cacheTbl[url] = response.Body;
			return true,response.Body;
		else
			return false,response;
		end
	elseif(cache) then
		return true,cacheTbl[url];
	end
end

--------------- Return: ---------------

return module;