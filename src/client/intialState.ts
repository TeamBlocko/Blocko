import { ReplicatedStorage } from "@rbxts/services";

const shapes = ReplicatedStorage.BlockTypes;

export const intialPlacementSettings: PlacementSettings = {
	Shape: shapes.Block,
	BuildMode: "Spectate",
	RawProperties: {
		Material: Enum.Material.Plastic,
		Anchored: true,
		CastShadow: true,
		Size: new Vector3(2, 2, 2),
		Transparency: 0,
		Reflectance: 0,
		Color: Color3.fromRGB(0, 0, 30),
	},
};

export const intialState: IState = {
	PlacementSettings: intialPlacementSettings,
};
