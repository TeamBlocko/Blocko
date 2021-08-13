import { Players, ReplicatedStorage, RunService } from "@rbxts/services";

export const DEFAULT_WORLD_SETTINGS: WorldSettings = {
	Name: "nyzem world #1",
	Description: "No description set.",
	Icon: "",
	Thumbnail: "",
	Ambient: Color3.fromRGB(127, 127, 127),
	OutdoorAmbient: Color3.fromRGB(127, 127, 127),
	Time: 12,
	CycleEnabled: false,
	Cycle: 0,
	Brightness: 2,
	SoundID: 0,
	Volume: 0.5,
	Pitch: 0,
	IsPlaying: false,
	ResetEnabled: true,
	CollisionsEnabled: true,
	UsernameDistance: 50,
	HealthDistance: 50,
	DefaultWalkSpeed: 16,
	DefaultJumpPower: 50,
	MinCameraZoom: 0,
	MaxCameraZoom: 100,
	GlobalShadows: true,
	EnvironmentDiffuseScale: 1,
	EnvironmentSpecularScale: 1,
	ExposureCompensation: 0,
};

export const DEFAULT_WORLD_INFO: WorldInfo = {
	WorldId: game.PlaceId,
	Owner:
		RunService.IsStudio() || game.CreatorId !== 6467229
			? (Players.GetPlayers()[0] || Players.PlayerAdded.Wait()[0]).UserId
			: 0,
	Permissions: [],
	Banned: [],
	Server: game.JobId,
	MaxPlayers: 25,
	ActivePlayers: game.PlaceId === 5102036961 ? 0 : Players.GetPlayers().size(),
	PlaceVisits: 0,
	NumberOfBlocks: ReplicatedStorage.Template.GetChildren().size(),
};

export const DEFAULT_WORLD: World = {
	Info: DEFAULT_WORLD_INFO,
	Settings: DEFAULT_WORLD_SETTINGS,
};
