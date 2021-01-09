import Roact from "@rbxts/roact";
import Catagory from "./Catagory";
import Slider from "client/components/GraphicalWidget/Slider";
import CheckBox from "client/components/GraphicalWidget/CheckBox";

function Characters() {
	return (
		<frame BackgroundTransparency={1} Size={new UDim2(0.95, 0, 0, 535)}>
			<uicorner CornerRadius={new UDim(0.05, 0)} />
			<Catagory Text="Characters" Image="rbxassetid://3926305904" />
			<CheckBox Name="Reset Allowed" Default={true} OnChange={(newValue) => print(newValue)} />
			<CheckBox Name="Collision" Default={true} OnChange={(newValue) => print(newValue)} />
			<Slider Name="Username View Distance" Min={0} Max={100} Default={50} OnChange={(newValue) => print(newValue)} />
			<Slider Name="Health View Distance" Min={0} Max={100} Default={50} OnChange={(newValue) => print(newValue)} />
			<Slider Name="Walk Speed" Min={0} Max={100} Default={16} OnChange={(newValue) => print(newValue)} />
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 10)} />
		</frame>
	);
}

export default Characters;
