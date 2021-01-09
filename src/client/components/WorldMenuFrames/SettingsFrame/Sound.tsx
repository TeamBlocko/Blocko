import Roact from "@rbxts/roact";
import Catagory from "./Catagory";
import Slider from "client/components/GraphicalWidget/Slider";
import InputFrame from "client/components/GraphicalWidget/InputFrame";

function Sound() {
	return (
		<frame BackgroundTransparency={1} Size={new UDim2(0.95, 0, 0, 225)}>
			<uicorner CornerRadius={new UDim(0.05, 0)} />
			<Catagory Text="Sound" Image="rbxassetid://3926307971" />
			<InputFrame Name="Audio ID" Length={40}>
				<frame
					Size={UDim2.fromScale(1, 0)}
				>
					<imagebutton
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundTransparency={1}
						Position={new UDim2(0.925, 0, 0.25, 10)}
						Size={UDim2.fromOffset(20, 20)}
						Image="rbxassetid://3926307971"
						ImageColor3={Color3.fromRGB(199, 199, 199)}
						ImageRectOffset={new Vector2(764, 244)}
						ImageRectSize={new Vector2(36, 36)}
						ScaleType={Enum.ScaleType.Fit}
					/>
				</frame>
			</InputFrame>
			<Slider Name="Volume" Min={0} Max={10} Default={3} OnChange={(newValue) => print(newValue)} />
			<Slider Name="Pitch" Min={0} Max={100} Default={0} OnChange={(newValue) => print(newValue)} />
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 10)} />
		</frame>
	);
}

export default Sound;
