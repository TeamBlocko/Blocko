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

	LayoutOrder?: number;
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

declare interface ReplicatedStorage {
	TS: {
		version: StringValue;
	} & Folder;
}

declare interface Item {
	Name: string;
}

declare interface Range {
	Min: number;
	Max: number;
}

declare interface SliderPropTypes extends Range, GWPropTypes<number> {
  SizeYOffset?: number;
	RefValue?: Roact.Ref<Frame>;
	BackgroundTransparency?: number;
}

declare interface ColorDisplayStateTypes extends GWStateTypes<Color3> {
	Selected: boolean;
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

declare type RGB = "R" | "G" | "B";

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
	OnClose: (inputButton: ImageButton) => void;
	UpdateColorPickerBinding?: Roact.RoactBindingFunc<Frame | undefined>;
}

declare interface ColorPickerStateTypes extends GWStateTypes<Color3> {
	ShouldUpdate?: boolean;
}

declare interface SliderDisplayPropTypes {
	Range: Range;
	Value: number;
}

declare interface ValidateTextOptions {
	Range?: Range;
	decimalPlace?: number;
}

declare interface RawProperties {
	Material: Enum.Material;
	CastShadow: boolean;
	CanCollide: boolean;
	Size: Vector3;
	Transparency: number;
	Reflectance: number;
	Color: Color3;
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

interface WorldInfo {
	WorldId: number;
	Owner: number;
	Permissions: PermissionsInfo[];
	Banned: number[];
	Server?: string;
	MaxPlayers: number;
	ActivePlayers: number;
	PlaceVisits: number;
	NumberOfBlocks: number;
}

declare type PermissionTypes = "TeamBlocko" | "Builder" | "Admin" | "Visitor" | "Owner"

declare interface PermissionsInfo {
	UserId: number;
	Type: PermissionTypes
}

declare interface World {
	Info: WorldInfo,
	Settings: WorldSettings
}

declare type BuildMode = "Spectate" | "Place" | "Delete"

declare interface WorldMenuFrames {
	RefValue: Roact.Ref<Frame>;
	OnClick: (e: GuiButton) => void;
}

declare interface iNotification {
  Id: string;
  OnRemoval?: () => void;
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

declare type RemoteNotification = { Type: "Add", Data: iNotification } | { Type: "Remove", Id: string }

declare type Filter = "Active" | "Featured" | "Owned"

declare type FetchWorldsResult = {
	success: true,
	data: number[],
} | {
	success: false,
	error: string,
}

declare type FetchWorldInfoResult = {
	success: true,
	data: World,
} | {
	success: false,
	error: string,
}

declare interface WorldDataSync {
	data: ser.ser.Serialized<World>
}

declare interface PlayerDataSync {
	data: {
		ownedWorlds: number[]
	}
}

type PermissionNames = "TransferOwnership" | "Build" | "ManagePermissions";

declare interface Permissions {
	Inherit?: PermissionTypes,
	TransferOwnership?: boolean,
	ManagePermissions?: boolean,
	Build?: boolean,
}
