import type Roact from "@rbxts/roact"

declare global {

	type ValueOf<T> = T[keyof T];

	interface GWPropTypes<T> {
		/**
		 * Default value that will be given to the element.
		 **/
		Default: T;
		Name: string;
		OnChange: (newValue: T) => void;

		LayoutOrder?: number;
	}

	interface GWStateTypes<T> {
		/**
		 * Current selected value.
		 **/
		Value: T;
	}

	/*
	 * Shapes included in ReplicatedStorage.BlockTypes
	 */
	enum Shapes {
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

	interface ReplicatedStorage {
		BlockTypes: Folder & { [P in keyof typeof Shapes]: BasePart };
		Template: Folder;
	}

	interface Workspace {
		Blocks: Folder;
	}

	interface ReplicatedStorage {
		TS: {
			version: StringValue;
		} & Folder;
	}

	interface Item {
		Name: string;
	}

	interface Range {
		Min: number;
		Max: number;
	}

	interface SliderPropTypes extends Range, GWPropTypes<number> {
		SizeYOffset?: number;
		RefValue?: Roact.Ref<Frame>;
		BackgroundTransparency?: number;
		DeciminalPlace?: number;
	}

	interface ColorDisplayStateTypes extends GWStateTypes<Color3> {
		Selected: boolean;
	}

	class ColorPicker extends Roact.Component<ColorPickerPropTypes, GWStateTypes<Color3>> {
		public render(): Roact.Element | undefined;
	}

	type ColorPickerSetState = Roact.Component<GWStateTypes<Color3>>["setState"];

	class ColorPickerManager {
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

	type RGB = "R" | "G" | "B";

	interface onTextChange {
		(type: RGB, value: number): void;
	}

	type GWType = "Slider" | "Dropdown" | "CheckBox" | "ColorDisplay";

	interface GWInfo<T> {
		Type: GWType;
		Data: GWPropTypes<T>;
	}

	interface ColorPickerPropTypes {
		Value: Color3;
		Name: string;
		Visible: boolean;
		onChange: (color: Color3) => void;
		OnClose: (inputButton: ImageButton) => void;
		UpdateColorPickerBinding?: Roact.BindingFunction<Frame | undefined>;
	}

	interface ColorPickerStateTypes extends GWStateTypes<Color3> {
		ShouldUpdate?: boolean;
	}

	interface SliderDisplayPropTypes {
		Range: Range;
		Value: number;
	}

	interface ValidateTextOptions {
		Range?: Range;
		decimalPlace?: number;
	}

	interface RawProperties {
		Material: Enum.Material;
		CastShadow: boolean;
		CanCollide: boolean;
		Size: Vector3;
		Transparency: number;
		Reflectance: number;
		Color: Color3;
	}

	interface WorldSettings {
		Name: string;
		Description: string;
		Icon: string;
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
		GlobalShadows: boolean;
		EnvironmentSpecularScale: number;
		EnvironmentDiffuseScale: number;
		ExposureCompensation: number;
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

	type PermissionTypes = "TeamBlocko" | "Builder" | "Admin" | "Visitor" | "Owner"

	interface PermissionsInfo {
		UserId: number;
		Type: PermissionTypes
	}

	interface World {
		Info: WorldInfo,
		Settings: WorldSettings
	}

	type BuildMode = "Spectate" | "Place" | "Delete"

	interface WorldMenuFrames {
		RefValue: Roact.Ref<Frame>;
		OnClick: (e: GuiButton) => void;
	}

	interface iNotification {
		Id: string;
		OnRemoval?: () => void;
		Title: string;
		Message?: string;
		Width?: number;
		HasBeenRemoved?: boolean;
		Icon: string;
		isApplyPrompt?: boolean;
		OnCancelPrompt?: () => void;
		OnApplyPrompt?: () => void;
		Time?: number;
	}

	type RemoteNotification = { Type: "Add", Data: iNotification } | { Type: "Remove", Id: string }

	type Filter = "Active" | "Featured" | "Owned"

	type FetchWorldsResult = {
		success: true,
		data: number[],
	} | {
		success: false,
		error: string,
	}

	type FetchWorldInfoResult = {
		success: true,
		data: World,
	} | {
		success: false,
		error: string,
	}

	interface WorldDataSync {
		data: ser.ser.Serialized<World>
	}

	interface PlayerDataSync {
		data: {
			ownedWorlds: number[]
		}
	}

	type PermissionNames = "TransferOwnership" | "Build" | "ManagePermissions";

	interface Permissions {
		Inherit?: PermissionTypes,
		TransferOwnership?: boolean,
		ManagePermissions?: boolean,
		Build?: boolean,
	}

	interface CreationOptions {
		Template: "MiniBaseplate";
		Name?: string;
		Description?: string;
		Lighting: Enum.Technology;
	}

}
