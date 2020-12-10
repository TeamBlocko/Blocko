declare interface PropTypes {
	/**
	 * Number represting the place of element in an element using UIListLayout/UIGridLayout.
	 **/
	LayoutOrder: number;
	Name: string;
	[Roact.Children]?: RoactNode;
}

declare interface GWPropTypes<T> extends PropTypes {
	/**
	 * Default value that will be given to the element.
	 **/
	Default: T;

	OnChange: <V>(newValue: V) => void;
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
	/**
	 * Values that will be displayed in Dropdown
	 **/
	Items: T[];
	/**
	 * Returns actual value from string passed.
	 **/
	GetValue: (value: string) => T;
}

declare interface Item {
	Name: string;
}

declare interface SliderPropTypes<T> extends GWPropTypes<T> {
	Min: number;
	Max: number;
}
