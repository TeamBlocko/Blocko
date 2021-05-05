import Roact from "@rbxts/roact"
import WorldFrame from "hub/client/components/WorldFrame";

const DEFAULT_WORLD_SETTINGS: WorldSettings = {
	Name: "nyzem world #1",
	Description: "No description set.",
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
};

const DEFAULT_WORLD_INFO: WorldInfo = {
	WorldId: game.PlaceId,
	Owner: 1,
	Permissions: [],
	Banned: [],
	Server: game.JobId,
	MaxPlayers: 25,
	ActivePlayers: 20,
	PlaceVisits: 0,
	NumberOfBlocks: 10,
};


export = (target: GuiBase2d) => {
	const handle = Roact.mount(<WorldFrame
		Info={DEFAULT_WORLD_INFO}
		Settings={DEFAULT_WORLD_SETTINGS}
	/>, target);

	return () => {
		Roact.unmount(handle);
	};
};
