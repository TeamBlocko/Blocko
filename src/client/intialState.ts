import { ReplicatedStorage } from "@rbxts/services";
import { retriveWorldSettings } from "./replicationManager";

const shapes = ReplicatedStorage.BlockTypes;

export const intialPlacementSettings: PlacementSettings = {
	Shape: shapes.Block,
	BuildMode: "Spectate",
	RawProperties: {
		Material: Enum.Material.Plastic,
		CastShadow: true,
		Size: new Vector3(2, 2, 2),
		Transparency: 0,
		Reflectance: 0,
		Color: Color3.fromRGB(60, 164, 255),
	},
};

export const intialState: IState = {
	PlacementSettings: intialPlacementSettings,
	WorldInfo: retriveWorldSettings(),
};
