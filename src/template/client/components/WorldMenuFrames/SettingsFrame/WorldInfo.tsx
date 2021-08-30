import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import Container from "./SettingsContainer";
import { updateWorldSettings } from "template/shared/worldSettingsReducer";
import Catagory from "./Catagory";
import InputBox from "template/client/components/GraphicalWidget/InputFrame";
import ImageInput from "./ImageInput";
import { IState } from "template/shared/Types";
import Rodux from "@rbxts/rodux";
import { StoreActions } from "template/client/store";

interface WorldInfoPropTypes extends MappedProps, MappedDispatch {}

interface MappedProps {
	Name: string;
	Description: string;
	Icon: string;
	Thumbnail: string;
}

interface MappedDispatch {
	UpdateSettings: (propertyName: "Name" | "Description" | "Icon" | "Thumbnail", value: string) => void;
}

class WorldInfo extends Roact.PureComponent<WorldInfoPropTypes> {
	render() {
		return (
			<Container>
				<uicorner CornerRadius={new UDim(0.05, 0)} />
				<Catagory Text="World Info" Image="rbxassetid://3926305904" />
				<InputBox
					Name="Name"
					Length={60}
					Default={this.props.Name}
					OnChange={(newValue) => this.props.UpdateSettings("Name", newValue)}
					HandleInput={(input) => (input.size() > 62 ? input.sub(0, 62) : input)}
				/>
				<InputBox
					Name="Description"
					Length={135}
					Default={this.props.Description}
					OnChange={(newValue) => this.props.UpdateSettings("Description", newValue)}
					HandleInput={(input) => (input.size() > 188 ? input.sub(0, 188) : input)}
				/>
				<ImageInput
					Name={"Icon"}
					Default={this.props.Icon}
					OnChange={(newValue) => this.props.UpdateSettings("Icon", newValue)}
				/>
				<ImageInput
					Name={"Thumbnail"}
					Default={this.props.Thumbnail}
					OnChange={(newValue) => this.props.UpdateSettings("Thumbnail", newValue)}
				/>
			</Container>
		);
	}
}

const mapStateToProps = ({ World: { Settings } }: IState): MappedProps => {
	return {
		Name: Settings.Name,
		Description: Settings.Description,
		Icon: Settings.Icon,
		Thumbnail: Settings.Thumbnail,
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

export default connect(mapStateToProps, mapDispatchToProps)(WorldInfo);
