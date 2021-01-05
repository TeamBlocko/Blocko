import Roact from "@rbxts/roact";

function NavigationFrame() {
	return (
		<frame
			BackgroundColor3={Color3.fromRGB(57, 57, 57)}
			BackgroundTransparency={1}
			BorderColor3={new Color3()}
			BorderSizePixel={0}
			ClipsDescendants={true}
			LayoutOrder={1}
			Size={UDim2.fromScale(1, 1)}
		>
			<uicorner />
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={Color3.fromRGB(57, 57, 57)}
				BackgroundTransparency={0.8}
				Position={UDim2.fromScale(0.5, 0)}
				Size={UDim2.fromOffset(300, 180)}
				Image={"rbxassetid://5303231665"}
				ScaleType={Enum.ScaleType.Crop}
			/>
			<frame
				AnchorPoint={new Vector2(0, 1)}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0, 1)}
				Size={new UDim2(1, 0, 1, -180)}
			>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
			</frame>
		</frame>
	);
}

export default NavigationFrame;
