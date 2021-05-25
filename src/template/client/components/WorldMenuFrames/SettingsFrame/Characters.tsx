import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import Container from "./SettingsContainer";
import Catagory from "./Catagory";
import { updateWorldSettings } from "template/shared/worldSettingsReducer";
import Slider from "template/client/components/GraphicalWidget/Slider";
import CheckBox from "template/client/components/GraphicalWidget/CheckBox";
import { IState } from "template/shared/Types";

interface CharactersPropTypes extends WorldSettings {
	OnSliderInputUpdate(
		propertyName:
			| "UsernameDistance"
			| "HealthDistance"
			| "DefaultWalkSpeed"
			| "DefaultJumpPower"
			| "MinCameraZoom"
			| "MaxCameraZoom",
		newValue: number,
	): void;
	OnCheckBoxUpdate(propertyName: "ResetEnabled" | "CollisionsEnabled", newValue: boolean): void;
}

function Characters(props: CharactersPropTypes) {
	return (
		<Container>
			<Catagory Text="Characters" Image="rbxassetid://3926305904" />
			<CheckBox
				Name="Reset Allowed"
				Default={props.ResetEnabled}
				OnChange={(newValue) => props.OnCheckBoxUpdate("ResetEnabled", newValue)}
			/>
			<CheckBox
				Name="Collision"
				Default={props.CollisionsEnabled}
				OnChange={(newValue) => props.OnCheckBoxUpdate("CollisionsEnabled", newValue)}
			/>
			<Slider
				Name="Username View Distance"
				Min={0}
				Max={100}
				Default={props.UsernameDistance}
				OnChange={(newValue) => props.OnSliderInputUpdate("UsernameDistance", newValue)}
			/>
			<Slider
				Name="Health View Distance"
				Min={0}
				Max={100}
				Default={props.HealthDistance}
				OnChange={(newValue) => props.OnSliderInputUpdate("HealthDistance", newValue)}
			/>
			<Slider
				Name="Walk Speed"
				Min={0}
				Max={100}
				Default={props.DefaultWalkSpeed}
				OnChange={(newValue) => props.OnSliderInputUpdate("DefaultWalkSpeed", newValue)}
			/>
			<Slider
				Name="Jump Power"
				Min={0}
				Max={100}
				Default={props.DefaultJumpPower}
				OnChange={(newValue) => props.OnSliderInputUpdate("DefaultJumpPower", newValue)}
			/>
			<Slider
				Name="Minimum Camera Zoom"
				Min={0}
				Max={400}
				Default={props.MinCameraZoom}
				OnChange={(newValue) => props.OnSliderInputUpdate("MinCameraZoom", newValue)}
			/>
			<Slider
				Name="Maximum Camera Zoom"
				Min={0}
				Max={400}
				Default={props.MaxCameraZoom}
				OnChange={(newValue) => props.OnSliderInputUpdate("MaxCameraZoom", newValue)}
			/>
			<uicorner CornerRadius={new UDim(0.05, 0)} />
		</Container>
	);
}

export default connect(
	(state: IState) => state.World.Settings,
	(dispatch) => ({
		OnSliderInputUpdate(
			propertyName:
				| "UsernameDistance"
				| "HealthDistance"
				| "DefaultWalkSpeed"
				| "DefaultJumpPower"
				| "MinCameraZoom"
				| "MaxCameraZoom",
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
		OnCheckBoxUpdate(propertyName: "ResetEnabled" | "CollisionsEnabled", value: boolean) {
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
)(Characters);
