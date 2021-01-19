declare type ValueOf<T> = T[keyof T];

declare interface PropTypes {
	[Roact.Children]?: RoactNode;
}

declare interface GWPropTypes<T> {
	/**
	 * Default value that will be given to the element.
	 **/
	Default: T;
	Name: string;
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

declare interface SliderPropTypes extends Range, GWPropTypes<number> {
	RefValue?: Roact.Ref<Frame>;
}

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
	CastShadow: boolean;
	Size: Vector3;
	Transparency: number;
	Reflectance: number;
	Color: Color3;
}

declare interface PlacementSettings {
	Shape: BasePart;
	BuildMode: BuildMode;
	RawProperties: RawProperties;
}

declare interface WorldSettings {
	Name: string;
	Description: string;
	Thumbnail: string;
	Ambient: Color3;
	OutdoorAmbient: Color3;
	Time: number;
	CycleEnabled: boolean;
	Cycle: number;
	Brightness: number;
	SoundID: number;
	Volume: number;
	IsPlaying: boolean;
	Pitch: number;
	ResetEnabled: boolean;
	CollisionsEnabled: boolean;
	UsernameDistance: number;
	HealthDistance: number;
	DefaultWalkSpeed: number;
	DefaultJumpPower: number;
	MinCameraZoom: number;
	MaxCameraZoom: number;
}

declare interface IState {
	PlacementSettings: PlacementSettings;
	WorldInfo: WorldInfo;
}

declare interface WorldInfo {
	WorldId: number;
	Owner: number;
	Banned: number[];
	Server: string;
	MaxPlayers: number;
	ActivePlayers: number;
	PlaceVisits: number;
	NumberOfBlocks: number;

	WorldSettings: WorldSettings;
}

declare type BuildMode = "Spectate" | "Place" | "Delete"

declare interface WorldMenuFrames {
	RefValue: Roact.Ref<Frame>;
	OnClick: (e: GuiButton) => void;
}

declare type ValueOfWorldSettings = ValueOf<WorldSettings>;

declare interface UpdateWorldSettingDataType {
	readonly propertyName: keyof WorldSettings;
	readonly value: string | boolean | number | Color3;
}

declare interface UpdateWorldInfoDataType {
	readonly propertyName: keyof WorldInfo;
	readonly value: string | number | number[];
}

declare interface UpdateWorldSettings {
	readonly data: UpdateWorldSettingDataType[];
	readonly replicateBroadcast?: boolean;
	readonly replicateTo?: number;
	readonly replicated?: boolean;
}

declare interface UpdateWorldInfo {
	readonly data: UpdateWorldInfoDataType[];
	readonly replicateBroadcast?: boolean;
	readonly replicateTo?: number;
	readonly replicated?: boolean;
}

declare type ActionRecievedUpdateWorldSettings = Rodux.Action<"UPDATE_WORLD_SETTINGS"> & UpdateWorldSettings

declare type ActionRecievedUpdateWorldInfo = Rodux.Action<"UPDATE_WORLD_INFO"> & UpdateWorldInfo

declare type WorldSettingsActionTypes = ActionRecievedUpdateWorldSettings | ActionRecievedUpdateWorldInfo;


declare interface iNotification {
  Id: string;
  OnRemoval?: Function;
  Title?: string;
  Message?: string;
  Width?: number;
  HasBeenRemoved?: boolean;
  Icon?: string;
 	isApplyPrompt?: boolean;
	OnCancelPrompt?: () => void;
	OnApplyPrompt?: () => void;
	Time?: number;
}

declare interface NotificationPropTypes extends iNotification {
	Position: UDim2;
	FrameSize: number;
	MaxWidth: number;
  toggleRemoval: (id: string) => void
}
