import { ReplicatedStorage } from "@rbxts/services";

const shapes = ReplicatedStorage.BlockTypes;

export const intialPlacementSettings: PlacementSettings = {
	Transparency: 0,
	Reflectance: 0,
	Color: Color3.fromRGB(0, 0, 30),
	Shape: shapes.Block,
	Material: Enum.Material.Plastic,
	Anchored: true,
	Shadows: true,
};

export const intialState: IState = {
	PlacementSettings: intialPlacementSettings,
};
