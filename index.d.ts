declare interface PropTypes {
	/**
	 * Key/Name given to element in Roact Tree.
	 **/
	Name?: string;
	/**
	 * Number represting the place of element in an element using UIListLayout/UIGridLayout.
	 **/
	LayoutOrder?: number;
}

declare interface GWPropTypes<T> extends PropTypes {
	/**
	 * Default value that will be given to the element.
	 **/
	Default: T;
}

declare interface GWStateTypes<T> {
	/**
	 * Current selected value.
	 **/
	Value: T;
}

/*
 * Shapes included in ReplicatedStorage.BlockTypes
 */
declare interface Shapes {
	[Part: string]: Instance;
	CornerInnerQuadrant: Part;
	CornerQuadrant: Part;
	CornerSphere: Part;
	CornerWedge: CornerWedgePart;
	Corner: Part;
	Cylinder: CylinderMesh;
	CutCylinder: Part;
	EdgeInnerQuadran: Part;
	EdgeQuadrant: Part;
	InnerEdgeWedge: Part;
	InvertedCornerSphere: Part;
	InvertedCutCylinder: Part;
	InvertedCylinder: Part;
	Sphere: Part;
	Block: Part;
	Truss: TrussPart;
	Wedge: WedgePart;
}

declare interface ReplicatedStorage {
	BlockTypes: Folder & Shapes;
}

declare interface DropdownPropTypes<T> extends GWPropTypes<T> {
	Items: T[];
	/**
	 * Returns actual value from string passed.
	 **/
	Handlers: {
		GetValue: (value: string) => T;
	};
}

declare interface Item {
	Name: string;
}

declare interface SliderPropTypes<T> extends GWPropTypes<T> {
	Min: number;
	Max: number;
}
