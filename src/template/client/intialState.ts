import { ReplicatedStorage } from "@rbxts/services";
import { IState, PlacementSettings } from "template/shared/Types";
import { retriveWorldSettings } from "./replicationManager";

const shapes = ReplicatedStorage.BlockTypes;

export const intialPlacementSettings: PlacementSettings = {
	Shape: shapes.Block,
	BuildMode: "Spectate",
	RawProperties: {
		Material: Enum.Material.Plastic,
		CastShadow: true,
		CanCollide: true,
		Size: new Vector3(4, 4, 4),
		Transparency: 0,
		Reflectance: 0,
		Color: Color3.fromRGB(255, 255, 255),
	},
	Functionalities: [],
};

export const intialState: IState = {
	ActivatedPicker: undefined,
	PlacementSettings: intialPlacementSettings,
	Debug: false,
	World: retriveWorldSettings(),
};
