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
import Rodux from "@rbxts/rodux";
import { StoreActions } from "template/client/store";

interface LightingPropTypes extends MappedProps, MappedDispatch {}

interface MappedProps {
	Brightness: number;
	Cycle: number;
	Time: number;
	EnvironmentDiffuseScale: number;
	EnvironmentSpecularScale: number;
	ExposureCompensation: number;
	CycleEnabled: boolean;
	GlobalShadows: boolean;
	Ambient: Color3;
	OutdoorAmbient: Color3;
}

interface MappedDispatch {
	UpdateSettings: (
		propertyName:
			| "Brightness"
			| "Cycle"
			| "Time"
			| "EnvironmentDiffuseScale"
			| "EnvironmentSpecularScale"
			| "ExposureCompensation"
			| "CycleEnabled"
			| "GlobalShadows"
			| "Ambient"
			| "OutdoorAmbient",
		value: number | boolean | Color3,
	) => void;
}

class Lighting extends Roact.PureComponent<LightingPropTypes> {
	render() {
		return (
			<Container layoutProps={{ SortOrder: Enum.SortOrder.LayoutOrder }}>
				<uicorner CornerRadius={new UDim(0.05, 0)} />
				<Catagory Text="Lighting" Image="rbxassetid://3926307971" />
				<ColorDisplay
					Name="Ambient"
					Default={this.props.Ambient}
					OnChange={(newValue) => this.props.UpdateSettings("Ambient", newValue)}
					LayoutOrder={1}
				/>
				<ColorDisplay
					Name="Outdoor Ambient"
					Default={this.props.OutdoorAmbient}
					OnChange={(newValue) => this.props.UpdateSettings("OutdoorAmbient", newValue)}
					LayoutOrder={2}
				/>
				<Slider
					Name="Time"
					Min={0}
					Max={12}
					Default={this.props.Time}
					OnChange={(newValue) => this.props.UpdateSettings("Time", newValue)}
					LayoutOrder={3}
				/>
				<Slider
					Name="Brightness"
					Min={0}
					Max={10}
					Default={this.props.Brightness}
					OnChange={(newValue) => this.props.UpdateSettings("Brightness", newValue)}
					LayoutOrder={4}
				/>
				<SliderAndCheckBox
					Name="Cycle"
					SliderSettings={{
						Min: 0,
						Max: 10,
						Default: this.props.Cycle,
						OnChange: (newValue) => this.props.UpdateSettings("Cycle", newValue),
						LayoutOrder: 5,
					}}
					CheckBoxSettings={{
						Default: this.props.CycleEnabled,
						OnChange: (newValue) => this.props.UpdateSettings("CycleEnabled", newValue),
					}}
				/>
				<CheckBox
					Name="Global Shadows"
					Default={this.props.GlobalShadows}
					OnChange={(newValue) => this.props.UpdateSettings("GlobalShadows", newValue)}
					LayoutOrder={6}
				/>
				<Slider
					Name="Environment Diffuse Scale"
					Default={this.props.EnvironmentDiffuseScale}
					Min={0}
					Max={1}
					DecimalPlace={2}
					OnChange={(newValue) => this.props.UpdateSettings("EnvironmentDiffuseScale", newValue)}
					LayoutOrder={7}
				/>
				<Slider
					Name="Environment Specular Scale"
					Default={this.props.EnvironmentSpecularScale}
					Min={0}
					Max={1}
					DecimalPlace={2}
					OnChange={(newValue) => this.props.UpdateSettings("EnvironmentSpecularScale", newValue)}
					LayoutOrder={8}
				/>
				<Slider
					Name="Exposure Compensation"
					Default={this.props.ExposureCompensation}
					Min={0}
					Max={3}
					DecimalPlace={2}
					OnChange={(newValue) => this.props.UpdateSettings("ExposureCompensation", newValue)}
					LayoutOrder={9}
				/>
			</Container>
		);
	}
}

const mapStateToProps = ({ World: { Settings } }: IState): MappedProps => {
	return {
		Brightness: Settings.Brightness,
		Ambient: Settings.Ambient,
		Cycle: Settings.Cycle,
		CycleEnabled: Settings.CycleEnabled,
		EnvironmentDiffuseScale: Settings.EnvironmentDiffuseScale,
		EnvironmentSpecularScale: Settings.EnvironmentSpecularScale,
		ExposureCompensation: Settings.ExposureCompensation,
		GlobalShadows: Settings.GlobalShadows,
		OutdoorAmbient: Settings.OutdoorAmbient,
		Time: Settings.Time,
	};
};

const mapDispatchToProps = (dispatch: Rodux.Dispatch<StoreActions>): MappedDispatch => {
	return {
		UpdateSettings: (propertyName, value) => {
			dispatch(
				updateWorldSettings([
					{
						propertyName,
						value,
					},
				]),
			);
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Lighting);
