import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import Container from "./SettingsContainer";
import Catagory from "./Catagory";
import { updateWorldSettings } from "template/shared/worldSettingsReducer";
import Slider from "template/client/components/GraphicalWidget/Slider";
import CheckBox from "template/client/components/GraphicalWidget/CheckBox";
import { IState } from "template/shared/Types";
import Rodux from "@rbxts/rodux";
import { StoreActions } from "template/client/store";

interface CharactersPropTypes extends MappedProps, MappedDispatch {}

interface MappedProps {
	ResetEnabled: boolean;
	CollisionsEnabled: boolean;
	UsernameDistance: number;
	HealthDistance: number;
	DefaultWalkSpeed: number;
	DefaultJumpPower: number;
	MinCameraZoom: number;
	MaxCameraZoom: number;
}

interface MappedDispatch {
	UpdateSettings: (
		propertyName:
			| "UsernameDistance"
			| "HealthDistance"
			| "DefaultWalkSpeed"
			| "DefaultJumpPower"
			| "MinCameraZoom"
			| "MaxCameraZoom"
			| "ResetEnabled"
			| "CollisionsEnabled",
		newValue: number | boolean,
	) => void;
}

class Characters extends Roact.PureComponent<CharactersPropTypes> {
	render() {
		return (
			<Container>
				<Catagory Text="Characters" Image="rbxassetid://3926305904" />
				<CheckBox
					Name="Reset Allowed"
					Default={this.props.ResetEnabled}
					OnChange={(newValue) => this.props.UpdateSettings("ResetEnabled", newValue)}
				/>
				<CheckBox
					Name="Collision"
					Default={this.props.CollisionsEnabled}
					OnChange={(newValue) => this.props.UpdateSettings("CollisionsEnabled", newValue)}
				/>
				<Slider
					Name="Username View Distance"
					Min={0}
					Max={100}
					Default={this.props.UsernameDistance}
					OnChange={(newValue) => this.props.UpdateSettings("UsernameDistance", newValue)}
				/>
				<Slider
					Name="Health View Distance"
					Min={0}
					Max={100}
					Default={this.props.HealthDistance}
					OnChange={(newValue) => this.props.UpdateSettings("HealthDistance", newValue)}
				/>
				<Slider
					Name="Walk Speed"
					Min={0}
					Max={100}
					Default={this.props.DefaultWalkSpeed}
					OnChange={(newValue) => this.props.UpdateSettings("DefaultWalkSpeed", newValue)}
				/>
				<Slider
					Name="Jump Power"
					Min={0}
					Max={100}
					Default={this.props.DefaultJumpPower}
					OnChange={(newValue) => this.props.UpdateSettings("DefaultJumpPower", newValue)}
				/>
				<Slider
					Name="Minimum Camera Zoom"
					Min={0}
					Max={400}
					Default={this.props.MinCameraZoom}
					OnChange={(newValue) => this.props.UpdateSettings("MinCameraZoom", newValue)}
				/>
				<Slider
					Name="Maximum Camera Zoom"
					Min={0}
					Max={400}
					Default={this.props.MaxCameraZoom}
					OnChange={(newValue) => this.props.UpdateSettings("MaxCameraZoom", newValue)}
				/>
				<uicorner CornerRadius={new UDim(0.05, 0)} />
			</Container>
		);
	}
}

const mapStateToProps = ({ World: { Settings } }: IState): MappedProps => {
	return {
		CollisionsEnabled: Settings.CollisionsEnabled,
		DefaultJumpPower: Settings.DefaultJumpPower,
		DefaultWalkSpeed: Settings.DefaultWalkSpeed,
		HealthDistance: Settings.HealthDistance,
		MaxCameraZoom: Settings.MaxCameraZoom,
		MinCameraZoom: Settings.MinCameraZoom,
		ResetEnabled: Settings.ResetEnabled,
		UsernameDistance: Settings.UsernameDistance,
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

export default connect(mapStateToProps, mapDispatchToProps)(Characters);
