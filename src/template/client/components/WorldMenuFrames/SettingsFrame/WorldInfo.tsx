import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import Container from "./SettingsContainer";
import { updateWorldSettings } from "template/shared/worldSettingsReducer";
import Catagory from "./Catagory";
import InputBox from "template/client/components/GraphicalWidget/InputFrame";
import ImageInput from "./ImageInput";
import { IState } from "template/shared/Types";

interface WorldInfoPropTypes extends WorldSettings {
	OnInputBoxUpdate(propertyName: "Name" | "Description", value: string): void;
}

function WorldInfo(props: WorldInfoPropTypes) {
	return (
		<Container>
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
		</Container>
	);
}

export default connect(
	(state: IState) => state.World.Settings,
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
