--[[
	This is my module that creates an autofill scroller (horribly written ofc).
	This is accessed to create emoji dropdowns and more.
]]

return function(chat,mouse,config)
	--------------- Variables: ---------------

	local scroller = chat.Container.ChatWindow.Autofill.Scroller;
	local label = chat.Container.ChatWindow.Chatbar.Box.AutofillLabel;
	local module = {}
	local connections = {};
	local keys = {};
	local inputEnded = {};
	local selectedLabel;
	local order = {};
	local pointer = 1;
	local x = 1;
	
	--------------- Functions: ---------------

	local tweenProperties = function(object,properties)
		game:GetService("TweenService"):Create(object,TweenInfo.new(0.16,Enum.EasingStyle.Quad,Enum.EasingDirection.Out),properties):Play();
	end

	local scale = function()
		local textSize = shared.better_chat.getSize();
		local amount = 0;
		for element,tbl in pairs(connections) do
			amount += 1;
			element.Size = UDim2.new(x,0,0,textSize);
		end
		local offset = amount >= 1 and textSize/2 or 0;
		local size = UDim2.new(1,0,0,math.clamp((scroller.Layout.AbsoluteContentSize.Y),0,textSize*12)+offset);
		label.TextSize = label.Parent.TextSize;
		scroller.Parent:TweenSize(size,Enum.EasingDirection.Out,Enum.EasingStyle.Quad,0.1,true);
		tweenProperties(scroller,{
			CanvasSize = UDim2.new(0,0,0,scroller.Layout.AbsoluteContentSize.Y);
		})
		scroller.Size = UDim2.new(scroller.Size.X.Scale,scroller.Size.X.Offset,0,math.clamp((scroller.Layout.AbsoluteContentSize.Y),0,textSize*12));
	end
	
	local inBounds = function(gui1,gui2) 
		local gui1_topLeft = gui1.AbsolutePosition;
		local gui1_bottomRight = gui1_topLeft + gui1.AbsoluteSize;
		local gui2_topLeft = gui2.AbsolutePosition;
		local gui2_bottomRight = gui2_topLeft + gui2.AbsoluteSize;
		return ((gui1_topLeft.x < gui2_bottomRight.x and gui1_bottomRight.x > gui2_topLeft.x) and (gui1_topLeft.y < gui2_bottomRight.y and gui1_bottomRight.y > gui2_topLeft.y));
	end
	
	local moveToCanvas = function(scroller,pointer)
		local textSize = shared.better_chat.getSize();
		tweenProperties(scroller,{
			CanvasPosition =  Vector2.new(0,(textSize*pointer)-textSize);
		},0.1)
	end
	
	local makeSelection = function(obj)
		local data = keys[obj];
		shared.better_chat.autofillData = data;
		selectedLabel = obj;
		for _,v in pairs(scroller:GetChildren()) do
			if(v.ClassName ~= "UIListLayout") then
				if(v == obj) then
					v.BackgroundTransparency = 0.8;
				else
					v.BackgroundTransparency = 1;
				end
			end
		end
		for k,v in pairs(order) do
			if(v == obj) then
				pointer = k;
				break;
			end
		end
		module.setLabel(data.text);
	end
	
	--------------- Methods: ---------------
	
	function module.setLabel(text)
		if(config.AutofillTextbox) then
			label.Text = text;
		end
	end
	
	function module.fill(elements,txt,symbol)
		module.setLabel("");
		if(config.AutofillMenu) then
			shared.better_chat.autofillData = nil;
			selectedLabel = nil;
			order = {};
			keys = {};
			pointer = 1;

			local createLabel = function(text,key,value,addon)
				addon = addon or "";
				local Label = Instance.new("TextLabel");
				Label.Name = "Label";
				Label.Parent = scroller;
				Label.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
				Label.BackgroundTransparency = 1.000;
				Label.Size = UDim2.new(x, 0, 0, 18);
				Label.Font = Enum.Font.SourceSansBold;
				Label.Text = " "..text;
				Label.TextColor3 = Color3.fromRGB(255, 255, 255);
				Label.TextScaled = true;
				Label.TextWrapped = true;
				Label.BorderSizePixel = 0;
				Label.TextXAlignment = Enum.TextXAlignment.Left;
				connections[Label] = {};

				local UICorner = Instance.new("UICorner");
				UICorner.CornerRadius = shared.better_chat.getRoundness();
				UICorner.Parent = Label;
				
				if(symbol) then
					keys[Label] = {
						text = (txt..key..symbol),
						filled = txt:sub(1,#txt-1)..value
					}
				else
					keys[Label] = {
						text = (txt..key),
						filled = txt..value
					}
				end

				mouse.onClick(Label,function()
					module.setLabel("");
					label.Parent:CaptureFocus();
					label.Parent.Text = keys[order[pointer]].filled;
					label.Parent.CursorPosition = string.len(label.Parent.Text) + 1000;
				end)

				mouse.mouseEnter(Label,function()
					makeSelection(Label);				
				end)
				
				table.insert(order,Label);
				return Label;
			end

			for _,object in pairs(scroller:GetChildren()) do
				if(object:IsA("TextLabel")) then
					connections[object] = nil;
					object:Destroy();
				end
			end
			
			local data = {};
			for _,object in pairs(elements) do
				if(string.len(object[1]) >= 1) then
					local a = createLabel(object[1],object[2],object[3],object[4]);
					table.insert(data,a);
				end
			end
			
			pcall(function()
				if(data[1]:GetFullName() ~= data[1].Name) then
					makeSelection(data[1]);
				end
			end)
			
			scale();
		end
	end
	
	--------------- Connections: ---------------
	
	if(config.AutofillMenu) then
		game:GetService("UserInputService").InputEnded:Connect(function(input,gameProcessed)
			inputEnded = {};
		end)
		
		game:GetService("UserInputService").InputBegan:Connect(function(input)
			local guid = game:GetService("HttpService"):GenerateGUID();
			if(input.KeyCode == Enum.KeyCode.Right or input.KeyCode == Enum.KeyCode.Left or input.KeyCode == Enum.KeyCode.Tab) then
				if(order[pointer] ~= nil) then
					module.setLabel("");
					label.Parent:CaptureFocus();
					label.Parent.Text = keys[order[pointer]].filled;
					label.Parent.CursorPosition = string.len(label.Parent.Text) + 1000;
				end
			elseif(input.KeyCode == Enum.KeyCode.Down) then
				local elapsed = 0;
				local len = 0.18;
				inputEnded[guid] = false;
				repeat
					if(pointer + 1 <= #order and not inputEnded[guid]) then
						pointer = pointer + 1;
						makeSelection(order[pointer]);
						if(not(inBounds(scroller,order[pointer]))) then
							moveToCanvas(scroller,pointer);
						end
					end
					wait(len);
					elapsed += len;
					len = len - (elapsed/15);
				until inputEnded[guid] == nil;
			elseif(input.KeyCode == Enum.KeyCode.Up) then
				local elapsed = 0;
				local len = 0.18;
				inputEnded[guid] = false;
				repeat
					if(pointer - 1 >= 1 and not inputEnded[guid]) then
						pointer = pointer - 1;
						makeSelection(order[pointer]);
						if(not(inBounds(scroller,order[pointer]))) then
							moveToCanvas(scroller,pointer);
						end
					end
					wait(len);
					elapsed += len;
					len = len - (elapsed/15);
				until inputEnded[guid] == nil;
			end
		end)
	end
	
	workspace.CurrentCamera:GetPropertyChangedSignal("ViewportSize"):Connect(function()
		game:GetService("RunService").Heartbeat:Wait();
		scale();
	end);
	scale();
	
	--------------- Return: ---------------

	return module
end