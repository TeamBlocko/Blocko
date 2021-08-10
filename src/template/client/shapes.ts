import { ReplicatedStorage } from "@rbxts/services";

const blockTypes = ReplicatedStorage.BlockTypes;

export const shapes = [
	blockTypes.Block,
	blockTypes.Wedge,
	blockTypes.CornerWedge,
	blockTypes.InnerEdgeWedge,
	blockTypes.Truss,
	blockTypes.Corner,
	blockTypes.Cylinder,
	blockTypes.InvertedCylinder,
	blockTypes.CutCylinder,
	blockTypes.InvertedCutCylinder,
	blockTypes.CornerQuadrant,
	blockTypes.EdgeQuadrant,
	blockTypes.EdgeInnerQuadran,
	blockTypes.CornerInnerQuadrant,
	blockTypes.Sphere,
	blockTypes.CornerSphere,
	blockTypes.InvertedCornerSphere,
];
