import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { updateWorldSettings } from "shared/worldSettingsReducer";
import Catagory from "./Catagory";
import InputBox from "client/components/GraphicalWidget/InputFrame";
import ImageInput from "./ImageInput";

interface WorldInfoPropTypes extends WorldSettings {
	OnInputBoxUpdate(propertyName: "Name" | "Description", value: string): void;
}

function WorldInfo(props: WorldInfoPropTypes) {
	return (
		<frame BackgroundTransparency={1} Size={new UDim2(0.95, 0, 0, 380)}>
			<uicorner CornerRadius={new UDim(0.05, 0)} />
			<Catagory Text="World Info" Image="rbxassetid://3926305904" />
			<InputBox
				Name="Name"
				Length={60}
				Default={props.Name}
				OnChange={(newValue) => props.OnInputBoxUpdate("Name", newValue)}
				HandleInput={(input) => (input.size() > 62 ? input.sub(0, 62) : input)}
			/>
			<InputBox
				Name="Description"
				Length={135}
				Default={props.Description}
				OnChange={(newValue) => props.OnInputBoxUpdate("Description", newValue)}
				HandleInput={(input) => (input.size() > 188 ? input.sub(0, 188) : input)}
			/>
			<ImageInput />
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 10)} />
		</frame>
	);
}

export default connect(
	(state: IState) => state.WorldSettings,
	(dispatch) => ({
		OnInputBoxUpdate(propertyName: "Name" | "Description", value: string) {
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
)(WorldInfo);
