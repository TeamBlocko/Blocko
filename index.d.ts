declare type ValueOf<T> = T[keyof T];

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

	OnChange: (newValue: T) => void;
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
declare enum Shapes {
	CornerInnerQuadrant,
	CornerQuadrant,
	CornerSphere,
	CornerWedge,
	Corner,
	Cylinder,
	CutCylinder,
	EdgeInnerQuadran,
	EdgeQuadrant,
	InnerEdgeWedge,
	InvertedCornerSphere,
	InvertedCutCylinder,
	InvertedCylinder,
	Sphere,
	Block,
	Truss,
	Wedge,
}

declare interface ReplicatedStorage {
	BlockTypes: Folder & { [P in keyof typeof Shapes]: BasePart };
	Template: Folder;
}

declare interface Workspace {
	Blocks: Folder;
}

declare interface Item {
	Name: string;
}

declare interface Range {
	Min: number;
	Max: number;
}

declare interface SliderPropTypes<T> extends Range, GWPropTypes<T> {}

declare interface ColorDisplayStateTypes<T> extends GWStateTypes<T> {
	Selected: boolean;
}

declare interface ColorPickerPropTypes {
	Value: Color3;
	Name: string;
	UpdateColorPickerBinding?: Roact.RoactBindingFunc<Frame | undefined>;
}

declare class ColorPicker extends Roact.Component<ColorPickerPropTypes, GWStateTypes<Color3>> {
	public render(): Roact.Element | undefined;
}

declare type ColorPickerSetState = Roact.Component<GWStateTypes<Color3>>["setState"];

declare class ColorPickerManager {
	public state: GWStateTypes<Color3>;
	public hue: number;
	public saturation: number;
	public cvalue: number;

	updateHueSatFromColor(): void;
	getHSFramePosition(e?: GuiObject): UDim2;
	getValueFramePosition(): UDim2;
	getColorSeq(): ColorSequence;
	HandleInput(input: InputObject): void;
	HandleValueInput(input: InputObject): void;
}

declare type RGB = "r" | "g" | "b";

declare interface onTextChange {
	(type: RGB, value: number): void;
}

declare type GWType = "Slider" | "Dropdown" | "CheckBox" | "ColorDisplay";

declare interface GWInfo<T> {
	Type: GWType;
	Data: GWPropTypes<T>;
}

declare interface ColorPickerPropTypes {
	Value: Color3;
	Name: string;
	onChange: (color: Color3) => void;
	UpdateColorPickerBinding?: Roact.RoactBindingFunc<Frame | undefined>;
}

declare interface ColorPickerStateTypes extends GWStateTypes<Color3> {
	ShouldUpdate?: boolean;
}

declare interface SliderDisplayPropTypes {
	Range?: Range;
	Value: number;
}

declare interface ValidateTextOptions {
	Range?: Range;
	decimalPlace?: number;
}

declare interface RawProperties {
	Material: Enum.Material;
	Anchored: boolean;
	CastShadow: boolean;
	Size: Vector3;
	Transparency: number;
	Reflectance: number;
	Color: Color3;
}

declare interface PlacementSettings {
	Shape: BasePart;
	RawProperties: RawProperties;
}

declare interface IState {
	PlacementSettings: PlacementSettings;
}

declare interface WorldInfo {
	WorldId: number;
	Name: string;
	Owner: number;
	Banned: number[];
	Server: string;
	MaxPlayers: number;
	ActivePlayers: number;
	Blocks: string;
}
