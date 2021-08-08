import { ser } from "@rbxts/ser";

export const permissionInfoScheme = {
	UserId: ser.number,
	Type: ser.string as ser.SerializerStructure<PermissionTypes>,
};

const PermissionInfo = ser.interface("PermissionInfo", permissionInfoScheme);

export const worldInfoScheme: { [K in keyof WorldInfo]: ser.SerializerStructure<WorldInfo[K]> } = {
	WorldId: ser.number,
	Owner: ser.number,
	Permissions: ser.array(PermissionInfo),
	Banned: ser.array(ser.number),
	Server: ser.optional(ser.string),
	MaxPlayers: ser.number,
	ActivePlayers: ser.number,
	PlaceVisits: ser.number,
	NumberOfBlocks: ser.number,
};

export const worldSettingsScheme: { [K in keyof WorldSettings]: ser.SerializerStructure<WorldSettings[K]> } = {
	Name: ser.string,
	Description: ser.string,
	Thumbnail: ser.string,
	Ambient: ser.Color3,
	OutdoorAmbient: ser.Color3,
	Time: ser.number,
	CycleEnabled: ser.boolean,
	Cycle: ser.number,
	Brightness: ser.number,
	SoundID: ser.number,
	Volume: ser.number,
	Pitch: ser.number,
	IsPlaying: ser.boolean,
	ResetEnabled: ser.boolean,
	CollisionsEnabled: ser.boolean,
	UsernameDistance: ser.number,
	HealthDistance: ser.number,
	DefaultWalkSpeed: ser.number,
	DefaultJumpPower: ser.number,
	MinCameraZoom: ser.number,
	MaxCameraZoom: ser.number,
	GlobalShadows: ser.boolean,
	EnvironmentDiffuseScale: ser.number,
	EnvironmentSpecularScale: ser.number,
	ExposureCompensation: ser.number,
};

export const worldInfoSerializer = ser.interface("World", {
	Info: ser.interface("WorldInfo", worldInfoScheme),
	Settings: ser.interface("WorldSettings", worldSettingsScheme),
});
