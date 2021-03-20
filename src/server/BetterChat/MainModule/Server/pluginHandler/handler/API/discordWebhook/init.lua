--[[
	This module is a simple discord webhook embed wrapper to make pushing out webhooks efficient and easier. This can also be easily taken
	to use in your own work if needed.
]]

--------------- Module: ---------------

local discordWebhook = {
	httpService = require(script.Parent:WaitForChild("httpService")),
	utility = require(script:WaitForChild("utility"))
};

--------------- Methods: ---------------

function discordWebhook.new(url)
	assert(type(url) == "string","Expected type \"string\" for \"url\" parameter.");
	local webhook = {};
	local embed = {
		content = ""
	};
	local internalEmbeds = 0;
	local embeds = {};
	
	function webhook.setContent(text)
		assert(type(text) == "string","Expected type \"string\" for \"text\" parameter.");
		embed.content = text;
		return webhook;
	end
	
	function webhook.createEmbed()
		assert(internalEmbeds < 10,"You cannot have more than ten embeds in one webhook message.");
		local methods = {};
		local internalEmbed = {};
		internalEmbeds += 1;

		function methods.setColor(color)
			if(type(color) == "string" or typeof(color) == "Color3") then
				if(typeof(color) == "Color3") then
					color = discordWebhook.utility.rgbToHex(color);
				end
				internalEmbed.color = tonumber("0x"..tostring(color:gsub("#","")));
				return methods;
			else
				error("Expected type \"string\" or type \"Color3\" for \"color\" parameter.");
			end
		end
		
		function methods.setTitle(text)
			assert(type(text) == "string","Expected type \"string\" for \"text\" parameter.");
			internalEmbed.title = text;
			return methods;
		end
		
		function methods.setURL(url)
			assert(type(url) == "string","Expected type \"string\" for \"url\" parameter.");
			internalEmbed.url = url;
			return methods;
		end
		
		function methods.setAuthor(name,image,url)
			assert(type(name) == "string","Expected type \"string\" for \"name\" parameter.");
			local author = {name = name};
			for parameter,value in pairs({["icon_url"] = image,["url"] = url}) do
				if(value ~= nil) then
					assert(type(value) == "string",string.format("Expected type \"string\" for %q parameter.",parameter));
					author[parameter] = value;
				end
			end
			internalEmbed.author = author;
			return methods;
		end
		
		function methods.setDescription(text)
			assert(type(text) == "string","Expected type \"string\" for \"text\" parameter.");
			internalEmbed.description = text;
			return methods;
		end
		
		function methods.setThumbnail(url)
			assert(type(url) == "string","Expected type \"string\" for \"url\" parameter.");
			internalEmbed.thumbnail = {url = url};
			return methods;
		end
		
		function methods.addFields(...)
			for _,field in pairs({...}) do
				assert(type(field) == "table","Expected type \"table\" for \"field\"");
				for _,v in pairs({"name","value"}) do
					assert(type(field[v]),string.format("Expected type \"string\" for %q",v));
				end
				methods.addField(field.name,field.value,field.inline);
			end
			return methods;
		end
		
		function methods.addField(name,value,inline)
			assert(type(name) == "string","Expected type \"string\" for \"name\" parameter.");
			assert(type(value) == "string","Expected type \"string\" for \"value\" parameter.");
			if(inline ~= nil) then
				assert(type(inline) == "boolean","Expected type \"boolean\" for \"inline\" parameter.");
			else
				inline = false;
			end
			local field = {
				name = name,
				value = value,
				inline = inline
			}
			internalEmbed.fields = internalEmbed.fields or {};
			table.insert(internalEmbed.fields,field);
			return methods;
		end
		
		function methods.setImage(url)
			assert(type(url) == "string","Expected type \"string\" for \"url\" parameter.");
			internalEmbed.image = {url = url};
			return methods;
		end
		
		function methods.setThumbnail(url)
			assert(type(url) == "string","Expected type \"string\" for \"url\" parameter.");
			internalEmbed.thumbnail = {url = url};
			return methods;
		end
		
		function methods.setFooter(text,image)
			assert(type(text) == "string","Expected type \"string\" for \"text\" parameter.");
			local footer = {text = text};
			if(image ~= nil) then
				assert(type(image) == "string","Expected type \"string\" for \"image\" parameter.");
				footer.icon_url = image;
			end
			internalEmbed.footer = footer;
			return methods;
		end
		
		function methods.setTimestamp(date)
			if(date ~= nil) then
				assert(type(date) == "number","Expected type \"number\" for \"date\" parameter.");
			end
			internalEmbed.timestamp = discordWebhook.utility:getIso8601(date);
			return methods;
		end
		
		embed.embeds = embed.embeds or {};
		table.insert(embed.embeds,internalEmbed);
		table.insert(embeds,internalEmbed);

		return methods;
	end
	
	function webhook:post()
		return discordWebhook.httpService:requestAsync({
			url = url,
			method = "POST",
			body = game:GetService("HttpService"):JSONEncode(embed),
			headers = {["content-type"] = "application/json"}
		})
	end
	
	function webhook:getJSON()
		return game:GetService("HttpService"):JSONEncode(embed);
	end
	
	return webhook;
end

--------------- Return: ---------------

return discordWebhook;