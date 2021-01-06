import Roact from "@rbxts/roact";
import ElementSeperator from "client/components/misc/ElementSperator";
import NavFrameButton from "./NavFrameButton";
import Thumbnail from "client/components/misc/Thumbnail";
import Container from "../WorldMenuFramesContainer";

function NavigationFrame(props: WorldMenuFrames) {
	return (
		<Container Name="NagiationFrame" LayoutOrder={1} RefValue={props.RefValue}>
			<uicorner />
			<Thumbnail Position={UDim2.fromScale(0.5, 0)} />
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
					OnClick={(e) => props.OnClick(e)}
				/>
				<ElementSeperator LayoutOrder={2} />
				<NavFrameButton
					Text="Back To Hub"
					Color={Color3.fromRGB(200, 74, 74)}
					Icon="rbxassetid://5627768153"
					LayoutOrder={3}
					OnClick={() => print("Pressed")}
				/>
			</frame>
		</Container>
	);
}

export default NavigationFrame;
