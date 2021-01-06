import Roact from "@rbxts/roact";
import ElementSeperator from "./misc/ElementSperator";
import NavFrameButton from "./NavFrameButton";

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
				<NavFrameButton
					Text="World Info"
					Color={Color3.fromRGB(235, 235, 236)}
					Icon="rbxassetid://5627702525"
					LayoutOrder={1}
					Transparency={0.5}
				/>
				<ElementSeperator LayoutOrder={2} />
				<NavFrameButton
					Text="Back To Hub"
					Color={Color3.fromRGB(200, 74, 74)}
					Icon="rbxassetid://5627768153"
					LayoutOrder={3}
					Transparency={0}
				/>
			</frame>
		</frame>
	);
}

export default NavigationFrame;
