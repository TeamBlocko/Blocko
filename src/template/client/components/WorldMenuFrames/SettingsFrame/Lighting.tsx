import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import Catagory from "./Catagory";
import Container from "./SettingsContainer";
import { updateWorldSettings } from "template/shared/worldSettingsReducer";
import ColorDisplay from "template/client/components/GraphicalWidget/ColorDisplay";
import Slider from "template/client/components/GraphicalWidget/Slider";
import SliderAndCheckBox from "template/client/components/GraphicalWidget/SliderAndCheckbox";
import { IState } from "template/shared/Types";
import CheckBox from "../../GraphicalWidget/CheckBox";

interface LightingPropTypes extends WorldSettings {
	OnSliderUpdate(
		propertyName:
			| "Brightness"
			| "Cycle"
			| "Time"
			| "EnvironmentDiffuseScale"
			| "EnvironmentSpecularScale"
			| "ExposureCompensation",
		value: number,
	): void;
	OnCheckBoxUpdate(propertyName: "CycleEnabled" | "GlobalShadows", value: boolean): void;
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
				LayoutOrder={1}
			/>
			<ColorDisplay
				Name="Outdoor Ambient"
				Default={props.OutdoorAmbient}
				OnChange={(newValue) => props.OnColorPickerUpdate("OutdoorAmbient", newValue)}
				LayoutOrder={2}
			/>
			<Slider
				Name="Time"
				Min={0}
				Max={12}
				Default={props.Time}
				OnChange={(newValue) => props.OnSliderUpdate("Time", newValue)}
				LayoutOrder={3}
			/>
			<Slider
				Name="Brightness"
				Min={0}
				Max={10}
				Default={props.Brightness}
				OnChange={(newValue) => props.OnSliderUpdate("Brightness", newValue)}
				LayoutOrder={4}
			/>
			<SliderAndCheckBox
				Name="Cycle"
				SliderSettings={{
					Min: 0,
					Max: 10,
					Default: props.Cycle,
					OnChange: (newValue) => props.OnSliderUpdate("Cycle", newValue),
					LayoutOrder: 5,
				}}
				CheckBoxSettings={{
					Default: props.CycleEnabled,
					OnChange: (newValue) => props.OnCheckBoxUpdate("CycleEnabled", newValue),
				}}
			/>
			<CheckBox
				Name="Global Shadows"
				Default={props.GlobalShadows}
				OnChange={(newValue) => props.OnCheckBoxUpdate("GlobalShadows", newValue)}
				LayoutOrder={6}
			/>
			<Slider
				Name="Environment Diffuse Scale"
				Default={props.EnvironmentDiffuseScale}
				Min={0}
				Max={1}
				DeciminalPlace={2}
				OnChange={(newValue) => props.OnSliderUpdate("EnvironmentDiffuseScale", newValue)}
				LayoutOrder={7}
			/>
			<Slider
				Name="Environment Specular Scale"
				Default={props.EnvironmentSpecularScale}
				Min={0}
				Max={1}
				DeciminalPlace={2}
				OnChange={(newValue) => props.OnSliderUpdate("EnvironmentSpecularScale", newValue)}
				LayoutOrder={8}
			/>
			<Slider
				Name="Exposure Compensation"
				Default={props.ExposureCompensation}
				Min={0}
				Max={3}
				DeciminalPlace={2}
				OnChange={(newValue) => props.OnSliderUpdate("ExposureCompensation", newValue)}
				LayoutOrder={9}
			/>
		</Container>
	);
}

export default connect(
	(state: IState) => state.World.Settings,
	(dispatch) => ({
		OnSliderUpdate(
			propertyName:
				| "Brightness"
				| "Cycle"
				| "Time"
				| "EnvironmentDiffuseScale"
				| "EnvironmentSpecularScale"
				| "ExposureCompensation",
			value: number,
		) {
			dispatch(
				updateWorldSettings([
					{
						propertyName,
						value,
					},
				]),
			);
		},
		OnCheckBoxUpdate(propertyName: "CycleEnabled" | "GlobalShadows", value: boolean) {
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
