--[[
	This module sets up the UI scaling,fade effects,and core connections.
]]

return function(detectPlatform,chatSettings,mouse)
	--------------- Variables: ---------------

	local minTextSize = chatSettings.MinimumTextSize;
	local maxTextSize = chatSettings.MaximumTextSize;
	
	--------------- Functions: ---------------

	local scaleRatio = function(ratioObject)
		local relativeY = ratioObject.AbsoluteSize.Y/workspace.CurrentCamera.ViewportSize.Y;

		local scale = function()
			ratioObject.Size = UDim2.new(1,0,0,workspace.CurrentCamera.ViewportSize.Y*relativeY);
		end

		scale();
		workspace.CurrentCamera:GetPropertyChangedSignal("ViewportSize"):Connect(function()
			game:GetService("RunService").Heartbeat:Wait();
			scale();
		end);
	end
	
	--------------- Instancing: ---------------
	
	local chat = Instance.new("ScreenGui");
	local container = Instance.new("Frame");
	local chatWindow = Instance.new("Frame");
	local roundness = Instance.new("UICorner");
	local messageTextSizeRatio = Instance.new("TextLabel");
	local constraint = Instance.new("UITextSizeConstraint");
	local keepY = Instance.new("UIAspectRatioConstraint");
	local scroller = Instance.new("ScrollingFrame");
	local uiListLayout = Instance.new("UIListLayout");
	local chatbar = Instance.new("Frame");
	local box = Instance.new("TextBox");
	local roundness_2 = Instance.new("UICorner");
	local autofill = Instance.new("Frame");
	local roundness_3 = Instance.new("UICorner");
	local scroller2 = Instance.new("ScrollingFrame");
	local layout2 = Instance.new("UIListLayout");
	local autofillLabel = Instance.new("TextLabel");
	local chatbarCover = Instance.new("TextLabel");

	--------------- Framework modules: ---------------

	local modules = {
		LinkCoreConnections = require(script:WaitForChild("coreGuiChatConnections")),
		Fade = require(script:WaitForChild("fade")),
		Scale = require(script:WaitForChild("scale"))
	}

	--------------- Properties: ---------------

	chat.Name = "Chat";
	chat.Parent = game:GetService("Players").LocalPlayer:WaitForChild("PlayerGui");
	chat.ResetOnSpawn = false;
	
	container.Name = "Container";
	container.Parent = chat;
	container.BackgroundColor3 = Color3.fromRGB(255,255,255);
	container.BackgroundTransparency = 1;
	container.Size = detectPlatform() == "Desktop" and UDim2.new(0.3,0,0.35,0) or UDim2.new(0.35,0,0.4,0);
	container.Position = UDim2.new(0.008,0,0.005,0);
	
	chatWindow.Name = "ChatWindow";
	chatWindow.Parent = container;
	chatWindow.AnchorPoint = Vector2.new(0.5,0.5);
	chatWindow.BackgroundColor3 = Color3.fromRGB(0,0,0);
	chatWindow.BackgroundTransparency = 1.000;
	chatWindow.BorderColor3 = Color3.fromRGB(27,42,53);
	chatWindow.Position = UDim2.new(0.5,0,0.5,0);
	chatWindow.Size = UDim2.new(0.949999988,0,0.866666675,0);

	roundness.CornerRadius = UDim.new(0,16);
	roundness.Name = "Roundness";
	roundness.Parent = chatWindow;

	messageTextSizeRatio.Name = "MessageTextSizeRatio";
	messageTextSizeRatio.Parent = chatWindow;
	messageTextSizeRatio.AnchorPoint = Vector2.new(0,0.5);
	messageTextSizeRatio.BackgroundColor3 = Color3.fromRGB(255,255,255);
	messageTextSizeRatio.BackgroundTransparency = 1.000;
	messageTextSizeRatio.Position = UDim2.new(0,0,0.776666641,0);
	messageTextSizeRatio.Size = UDim2.new(1, 0,0.056, 0); -- UDim2.new(1,0,0.330000013,0);
	messageTextSizeRatio.Visible = false;
	messageTextSizeRatio.Font = Enum.Font.SourceSans;
	messageTextSizeRatio.TextColor3 = Color3.fromRGB(0,0,0);
	messageTextSizeRatio.TextScaled = true;
	messageTextSizeRatio.TextSize = 14.000;
	messageTextSizeRatio.TextWrapped = true;
	scaleRatio(messageTextSizeRatio);
	
	constraint.Name = "Constraint";
	constraint.Parent = messageTextSizeRatio;
	constraint.MinTextSize = minTextSize;
	constraint.MaxTextSize = maxTextSize;
	
	scroller.Name = "Scroller";
	scroller.Parent = chatWindow;
	scroller.AnchorPoint = Vector2.new(0.5,0);
	scroller.BackgroundColor3 = Color3.fromRGB(255,255,255);
	scroller.BackgroundTransparency = 1.000;
	scroller.BorderSizePixel = 0;
	scroller.Position = UDim2.new(0.5,0,0.0269230772,0);
	scroller.Selectable = false;
	scroller.Size = UDim2.new(0.980000019,0,0.796153843,0);
	scroller.ScrollBarThickness = 0;
	scroller.CanvasSize = UDim2.new(0,0,0,0);
	
	uiListLayout.Parent = scroller;
	uiListLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center;
	uiListLayout.SortOrder = Enum.SortOrder.LayoutOrder;
	
	chatbar.Name = "Chatbar";
	chatbar.Parent = chatWindow;
	chatbar.AnchorPoint = Vector2.new(0.5,1);
	chatbar.BackgroundColor3 = Color3.fromRGB(255,255,255);
	chatbar.BackgroundTransparency = 1.000;
	chatbar.Position = UDim2.new(0.5,0,0.980000019,0);
	chatbar.Size = UDim2.new(0.980000019,0,0,36);
	chatbar.BorderSizePixel = 0;
	
	box.Name = "Box";
	box.Parent = chatbar;
	box.AnchorPoint = Vector2.new(0.5,0.5);
	box.BackgroundColor3 = Color3.fromRGB(255,255,255);
	box.BackgroundTransparency = 1.000;
	box.Position = UDim2.new(0.5,0,0.5,0);
	box.Size = UDim2.new(0.949999988,0,1,0);
	box.Font = chatSettings.ChatBarFont;
	box.ClearTextOnFocus = false;
	box.PlaceholderColor3 = Color3.fromRGB(255,255,255);
	box.PlaceholderText = "Click here or press '/' to chat.";
	box.Text = "";
	box.TextColor3 = Color3.fromRGB(100,100,100);
	box.TextSize = 16.000;
	box.TextWrapped = true;
	box.TextXAlignment = Enum.TextXAlignment.Left;
	box.ZIndex = 2;
	box.BorderSizePixel = 0;

	roundness_2.CornerRadius = UDim.new(0,16);
	roundness_2.Name = "Roundness";
	roundness_2.Parent = chatbar;
	
	roundness_3.CornerRadius = UDim.new(0,16);
	roundness_3.Name = "Roundness";
	roundness_3.Parent = autofill;
	
	autofill.Name = "Autofill"
	autofill.Parent = chatWindow;
	autofill.BackgroundColor3 = Color3.fromRGB(0,0,0);
	autofill.BackgroundTransparency = 0.75;
	autofill.BorderSizePixel = 0;
	autofill.Position = UDim2.new(0,0,1.00999999,0);
	autofill.Size = UDim2.new(1,0,0,0);
	autofill.ClipsDescendants = true;
	
	roundness_3.CornerRadius = UDim.new(0,16);
	roundness_3.Name = "Roundness";
	roundness_3.Parent = autofill;

	scroller2.Name = "Scroller";
	scroller2.Parent = autofill;
	scroller2.Active = true;
	scroller2.AnchorPoint = Vector2.new(0.5,0.5);
	scroller2.BackgroundColor3 = Color3.fromRGB(255,255,255);
	scroller2.BackgroundTransparency = 1.000;
	scroller2.BorderSizePixel = 0;
	scroller2.Position = UDim2.new(0.5,0,0.5,0);
	scroller2.Size = UDim2.new(0.99,0,0.94,0);
	scroller2.CanvasSize = UDim2.new(0,0,0,50);
	scroller2.ScrollBarThickness = 0;

	layout2.Name = "Layout";
	layout2.Parent = scroller2;
	layout2.SortOrder = Enum.SortOrder.LayoutOrder;
	layout2.HorizontalAlignment = Enum.HorizontalAlignment.Center;
	
	autofillLabel.Name = "AutofillLabel";
	autofillLabel.Parent = box;
	autofillLabel.BackgroundColor3 = Color3.fromRGB(255,255,255);
	autofillLabel.BackgroundTransparency = 1.000;
	autofillLabel.BorderColor3 = Color3.fromRGB(27,42,53);
	autofillLabel.Size = UDim2.new(1,0,1,0);
	autofillLabel.Font = chatSettings.ChatBarFont;
	autofillLabel.Text = "";
	autofillLabel.TextColor3 = Color3.fromRGB(0,0,0);
	autofillLabel.TextSize = 16.000;
	autofillLabel.TextTransparency = 0.500;
	autofillLabel.TextXAlignment = Enum.TextXAlignment.Left;
	autofillLabel.TextWrapped = true;
	
	local chatbarCover = Instance.new("TextButton");
	local chatbarCoverText = Instance.new("TextLabel");
	local roundness = Instance.new("UICorner");
	
	chatbarCover.Name = "ChatbarCover";
	chatbarCover.Parent = box;
	chatbarCover.BackgroundColor3 = Color3.fromRGB(223,107,106);
	chatbarCover.BorderColor3 = Color3.fromRGB(27,42,53);
	chatbarCover.BorderSizePixel = 0;
	chatbarCover.Size = UDim2.new(0.0202994756,70,1,0);
	chatbarCover.ZIndex = 3;
	chatbarCover.Font = Enum.Font.GothamSemibold;
	chatbarCover.Text = "To Player1";
	chatbarCover.TextColor3 = Color3.fromRGB(255,255,255);
	chatbarCover.TextSize = 16.000;
	chatbarCover.Visible = false;
	
	chatbarCoverText.Name = "ChatbarCoverText";
	chatbarCoverText.Parent = chatbarCover;
	chatbarCoverText.BackgroundColor3 = Color3.fromRGB(223,107,106);
	chatbarCoverText.BackgroundTransparency = 1;
	chatbarCoverText.BorderColor3 = Color3.fromRGB(27,42,53);
	chatbarCoverText.BorderSizePixel = 0;
	chatbarCoverText.Size = UDim2.new(0.95,0,0.7,0);
	chatbarCoverText.ZIndex = 3;
	chatbarCoverText.Font = Enum.Font.GothamSemibold;
	chatbarCoverText.Text = "";
	chatbarCoverText.TextColor3 = Color3.fromRGB(255,255,255);
	chatbarCoverText.TextSize = 16.000;
	chatbarCoverText.Visible = false;
	chatbarCoverText.AnchorPoint = Vector2.new(0.5,0.5);
	chatbarCoverText.Position = UDim2.new(0.5,0,0.5,0);
	chatbarCoverText.TextScaled = true;
	
	roundness.CornerRadius = UDim.new(1,0);
	roundness.Name = "Roundness";
	roundness.Parent = chatbarCover;
	
	--------------- Link modules: ---------------
	
	shared.better_chat.currentSize = container.Size;
	coroutine.wrap(function()
		modules.LinkCoreConnections(chatWindow);
	end)();
	modules.Fade(chatWindow,mouse,chatSettings.FadeSettings or {});
	modules.Scale(box,detectPlatform,chatSettings);

	--------------- Return: ---------------

	return chat;
end