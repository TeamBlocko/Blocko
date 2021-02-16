import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { updateWorldSettings } from "shared/worldSettingsReducer";
import Catagory from "./Catagory";
import Slider from "client/components/GraphicalWidget/Slider";
import InputFrame from "client/components/GraphicalWidget/InputFrame";

interface SoundPropTypes extends WorldSettings {
	OnSliderUpdate(propertyName: "Volume" | "Pitch", value: number): void;
	OnCheckBoxUpdate(propertyName: "IsPlaying", value: boolean): void;
	OnInputBoxUpdate(propertyName: "SoundID", value: string): void;
}

function Sound(props: SoundPropTypes) {
	return (
		<frame BackgroundTransparency={1} Size={new UDim2(0.95, 0, 0, 205)}>
			<uicorner CornerRadius={new UDim(0.05, 0)} />
			<Catagory Text="Sound" Image="rbxassetid://3926307971" />
			<InputFrame
				Name="Sound Id"
				Length={60}
				TextYAlignment={Enum.TextYAlignment.Center}
				Default={tostring(props.SoundID)}
				OnChange={(newValue) => props.OnInputBoxUpdate("SoundID", newValue)}
				HandleInput={(input) => (input.match("%d+")[0] as string) || ""}
			>
				<imagebutton
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundTransparency={1}
					Position={new UDim2(0.9, 0, 0.5, 0)}
					Size={UDim2.fromOffset(20, 20)}
					Image={!props.IsPlaying ? "rbxassetid://3926307971" : "rbxassetid://3926307971"}
					ImageColor3={!props.IsPlaying ? Color3.fromRGB(199, 199, 199) : Color3.fromRGB(84, 169, 199)}
					ImageRectOffset={!props.IsPlaying ? new Vector2(764, 244) : new Vector2(804, 124)}
					ImageRectSize={new Vector2(36, 36)}
					ScaleType={Enum.ScaleType.Fit}
					Event={{
						Activated: () => props.OnCheckBoxUpdate("IsPlaying", !props.IsPlaying),
					}}
				/>
			</InputFrame>
			<Slider
				Name="Volume"
				Min={0}
				Max={10}
				Default={props.Volume}
				OnChange={(newValue) => props.OnSliderUpdate("Volume", newValue)}
			/>
			<Slider
				Name="Pitch"
				Min={0}
				Max={100}
				Default={props.Pitch}
				OnChange={(newValue) => props.OnSliderUpdate("Pitch", newValue)}
			/>
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 5)} />
		</frame>
	);
}

export default connect(
	(state: IState) => state.WorldInfo.WorldSettings,
	(dispatch) => ({
		OnSliderUpdate(propertyName: "Volume" | "Pitch", value: number) {
			dispatch(
				updateWorldSettings([
					{
						propertyName,
						value,
					},
				]),
			);
		},
		OnCheckBoxUpdate(propertyName: "IsPlaying", value: boolean) {
			dispatch(
				updateWorldSettings([
					{
						propertyName,
						value,
					},
				]),
			);
		},
		OnInputBoxUpdate(propertyName: "SoundID", value: string) {
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
)(Sound);
