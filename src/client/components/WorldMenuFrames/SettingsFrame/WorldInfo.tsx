import Roact from "@rbxts/roact";
import Catagory from "./Catagory";
import InputBox from "client/components/GraphicalWidget/InputFrame";
import ImageInput from "./ImageInput";

function WorldInfo() {
	return (
		<frame BackgroundTransparency={1} Size={new UDim2(0.95, 0, 0, 380)}>
			<uicorner CornerRadius={new UDim(0.05, 0)} />
			<Catagory Text="World Info" Image="rbxassetid://3926305904" />
			<InputBox Name="Name" Length={60} />
			<InputBox Name="Description" Length={135} />
			<ImageInput />
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 10)} />
		</frame>
	);
}

export default WorldInfo;
