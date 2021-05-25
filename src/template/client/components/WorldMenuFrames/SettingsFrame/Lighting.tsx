import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import Catagory from "./Catagory";
import Container from "./SettingsContainer";
import { updateWorldSettings } from "template/shared/worldSettingsReducer";
import ColorDisplay from "template/client/components/GraphicalWidget/ColorDisplay";
import Slider from "template/client/components/GraphicalWidget/Slider";
import SliderAndCheckBox from "template/client/components/GraphicalWidget/SliderAndCheckbox";
import { IState } from "template/shared/Types";

interface LightingPropTypes extends WorldSettings {
	OnSliderUpdate(propertyName: "Brightness" | "Cycle" | "Time", value: number): void;
	OnCheckBoxUpdate(propertyName: "CycleEnabled", value: boolean): void;
	OnColorPickerUpdate(propertyName: "Ambient" | "OutdoorAmbient", value: Color3): void;
}

function Lighting(props: LightingPropTypes) {
	return (
		<Container>
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
		</Container>
	);
}

export default connect(
	(state: IState) => state.World.Settings,
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
