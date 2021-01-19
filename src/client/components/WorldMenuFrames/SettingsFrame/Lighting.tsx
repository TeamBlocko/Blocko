import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import Catagory from "./Catagory";
import { updateWorldSettings } from "shared/worldSettingsReducer";
import ColorDisplay from "client/components/GraphicalWidget/ColorDisplay";
import Slider from "client/components/GraphicalWidget/Slider";
import SliderAndCheckBox from "client/components/GraphicalWidget/SliderAndCheckbox";

interface LightingPropTypes extends WorldSettings {
	OnSliderUpdate(propertyName: "Brightness" | "Cycle" | "Time", value: number): void;
	OnCheckBoxUpdate(propertyName: "CycleEnabled", value: boolean): void;
	OnColorPickerUpdate(propertyName: "Ambient" | "OutdoorAmbient", value: Color3): void;
}

function Lighting(props: LightingPropTypes) {
	return (
		<frame BackgroundTransparency={1} Size={new UDim2(0.95, 0, 0, 305)}>
			<uicorner CornerRadius={new UDim(0.05, 0)} />
			<Catagory Text="Lighting" Image="rbxassetid://3926307971" />
			<ColorDisplay
				Name="Ambient"
				Default={props.Ambient}
				OnChange={(newValue) => props.OnColorPickerUpdate("Ambient", newValue)}
			/>
			<ColorDisplay
				Name="Outdoor Ambient"
				Default={props.OutdoorAmbient}
				OnChange={(newValue) => props.OnColorPickerUpdate("OutdoorAmbient", newValue)}
			/>
			<Slider
				Name="Time"
				Min={0}
				Max={12}
				Default={props.Time}
				OnChange={(newValue) => props.OnSliderUpdate("Time", newValue)}
			/>
			<Slider
				Name="Brightness"
				Min={0}
				Max={10}
				Default={props.Brightness}
				OnChange={(newValue) => props.OnSliderUpdate("Brightness", newValue)}
			/>
			<SliderAndCheckBox
				Name="Cycle"
				SliderSettings={{
					Min: 0,
					Max: 10,
					Default: props.Cycle,
					OnChange: (newValue) => props.OnSliderUpdate("Cycle", newValue),
				}}
				CheckBoxSettings={{
					Default: props.CycleEnabled,
					OnChange: (newValue) => props.OnCheckBoxUpdate("CycleEnabled", newValue),
				}}
			/>
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 10)} />
		</frame>
	);
}

export default connect(
	(state: IState) => state.WorldInfo.WorldSettings,
	(dispatch) => ({
		OnSliderUpdate(propertyName: "Brightness" | "Cycle" | "Time", value: number) {
			dispatch(
				updateWorldSettings([
					{
						propertyName,
						value,
					},
				]),
			);
		},
		OnCheckBoxUpdate(propertyName: "IsPlaying" | "CycleEnabled", value: boolean) {
			dispatch(
				updateWorldSettings([
					{
						propertyName,
						value,
					},
				]),
			);
		},
		OnColorPickerUpdate(propertyName: "Ambient" | "OutdoorAmbient", value: Color3) {
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
