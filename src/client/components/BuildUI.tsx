import Roact from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";
import Dropdown from "./GraphicalWidget/Dropdown";
import Slider from "./GraphicalWidget/Slider";

const Shapes = (ReplicatedStorage as WorldReplicatedStorage).BlockTypes;

function BuildUI() {
	return (
		<frame
			Key="BuildUI"
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(35, 35, 35)}
			Position={UDim2.fromScale(0.2, 0.5)}
			Size={UDim2.fromOffset(225, 300)}
		>
			<uicorner CornerRadius={new UDim(0, 10)} />
			<uilistlayout
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				Padding={new UDim(0, 5)}
			/>
			<frame Size={UDim2.fromOffset(0, 5)} LayoutOrder={1} />
			<Dropdown
				Default={Shapes.Block}
				Name="Shape"
				LayoutOrder={3}
				Items={Shapes.GetChildren()}
				Handlers={{
					GetValue: (value) => Shapes[value],
				}}
			/>
			<Slider
				Name="Transprency"
				LayoutOrder={2}
				Min={0}
				Max={10}
				Default={0}
			/>
		</frame>
	);
}

export default BuildUI;
