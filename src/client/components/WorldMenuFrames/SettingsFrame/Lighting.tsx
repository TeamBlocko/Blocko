import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import Catagory from "./Catagory";
import { updateWorldSettings } from "shared/worldSettingsReducer";
import ColorDisplay from "client/components/GraphicalWidget/ColorDisplay";
import Slider from "client/components/GraphicalWidget/Slider";
import SliderAndCheckBox from "client/components/GraphicalWidget/SliderAndCheckbox";

interface LightingPropTypes extends WorldSettings {
	OnSliderUpdate(propertyName: string, value: number): void;
	// OnDropdownUpdate(propertyName: string, value: Instance | Enum.Material): void;
	// OnCheckBoxUpdate(propertyName: string, value: boolean): void;
	// OnColorPickerUpdate(propertyName: string, value: Color3): void;
}

function Lighting(props: LightingPropTypes) {
	return (
		<frame BackgroundTransparency={1} Size={new UDim2(0.95, 0, 0, 305)}>
			<uicorner CornerRadius={new UDim(0.05, 0)} />
			<Catagory Text="Lighting" Image="rbxassetid://3926307971" />
			<ColorDisplay Name="Ambient" Default={new Color3()} OnChange={(newValue) => print(newValue)} />
			<ColorDisplay Name="Outdoor Ambient" Default={new Color3()} OnChange={(newValue) => print(newValue)} />
			<Slider Name="Time" Min={0} Max={12} Default={0} OnChange={(newValue) => print(newValue)} />
			<Slider
				Name="Brightness"
				Min={0}
				Max={1}
				Default={props.Brightness}
				OnChange={(newValue) => props.OnSliderUpdate("Brightness", newValue)}
			/>
			<SliderAndCheckBox
				Name="Cycle"
				SliderSettings={{ Min: 0, Max: 10, Default: 5, OnChange: (newValue) => print(newValue) }}
				CheckBoxSettings={{ Default: false, OnChange: (newValue) => print(newValue) }}
			/>
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 10)} />
		</frame>
	);
}

export default connect(
	(state: IState) => state.WorldSettings,
	(dispatch) => ({
		OnSliderUpdate(propertyName: "Brightness", value: number) {
			dispatch(
				updateWorldSettings([
					{
						propertyName,
						value,
					},
				]),
			);
		},
	}),
)(Lighting);
