import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import Container from "./SettingsContainer";
import { updateWorldSettings } from "template/shared/worldSettingsReducer";
import Catagory from "./Catagory";
import Slider from "template/client/components/GraphicalWidget/Slider";
import InputFrame from "template/client/components/GraphicalWidget/InputFrame";
import { IState } from "template/shared/Types";
import Rodux from "@rbxts/rodux";
import { StoreActions } from "template/client/store";

interface SoundPropTypes extends MappedProps, MappedDispatch {}

interface MappedProps {
	SoundID: number;
	IsPlaying: boolean;
	Volume: number;
	Pitch: number;
}

interface MappedDispatch {
	UpdateWorldSetting: (propertyName: "Volume" | "Pitch" | "IsPlaying" | "SoundID", value: number | boolean) => void;
}

class Sound extends Roact.PureComponent<SoundPropTypes> {
	render() {
		return (
			<Container>
				<uicorner CornerRadius={new UDim(0.05, 0)} />
				<Catagory Text="Sound" Image="rbxassetid://3926307971" />
				<InputFrame
					Name="Sound Id"
					Length={50}
					Alignment={"Center"}
					Default={tostring(this.props.SoundID)}
					OnChange={(newValue) => this.props.UpdateWorldSetting("SoundID", tonumber(newValue) ?? 0)}
					HandleInput={(input) => input.match("%d+")[0] as string}
				>
					<imagebutton
						AnchorPoint={new Vector2(0, 0.5)}
						BackgroundTransparency={1}
						Position={new UDim2(0.9, 0, 0.5, 0)}
						Size={UDim2.fromOffset(20, 20)}
						Image={!this.props.IsPlaying ? "rbxassetid://3926307971" : "rbxassetid://3926307971"}
						ImageColor3={
							!this.props.IsPlaying ? Color3.fromRGB(199, 199, 199) : Color3.fromRGB(84, 169, 199)
						}
						ImageRectOffset={!this.props.IsPlaying ? new Vector2(764, 244) : new Vector2(804, 124)}
						ImageRectSize={new Vector2(36, 36)}
						ScaleType={Enum.ScaleType.Fit}
						Event={{
							Activated: () => this.props.UpdateWorldSetting("IsPlaying", !this.props.IsPlaying),
						}}
					/>
				</InputFrame>
				<Slider
					Name="Volume"
					Min={0}
					Max={10}
					Default={this.props.Volume}
					OnChange={(newValue) => this.props.UpdateWorldSetting("Volume", newValue)}
					DecimalPlace={2}
				/>
				<Slider
					Name="Pitch"
					Min={0}
					Max={100}
					Default={this.props.Pitch}
					OnChange={(newValue) => this.props.UpdateWorldSetting("Pitch", newValue)}
					DecimalPlace={2}
				/>
			</Container>
		);
	}
}

const mapStateToProps = ({ World: { Settings } }: IState): MappedProps => {
	return {
		IsPlaying: Settings.IsPlaying,
		Pitch: Settings.Pitch,
		SoundID: Settings.SoundID,
		Volume: Settings.Volume,
	};
};

const mapDispatchToProps = (dispatch: Rodux.Dispatch<StoreActions>): MappedDispatch => {
	return {
		UpdateWorldSetting: (propertyName, value) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Sound);
