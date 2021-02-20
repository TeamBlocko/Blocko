import { Lighting, RunService, Players, StarterGui } from "@rbxts/services";
import store from "./store";

// LIGHTING
export const Brightness = (newValue: number) => (Lighting.Brightness = newValue);

export const Ambient = (newValue: Color3) => (Lighting.Ambient = newValue);

export const OutdoorAmbient = (newValue: Color3) => (Lighting.OutdoorAmbient = newValue);

const intialState = store.getState().WorldInfo.WorldSettings;
const cycleInfo = { cycleRate: intialState.Cycle, enabled: intialState.CycleEnabled };
RunService.PreSimulation.Connect(() => {
	if (cycleInfo.enabled) Lighting.SetMinutesAfterMidnight(Lighting.GetMinutesAfterMidnight() + cycleInfo.cycleRate);
});

export const Time = (newValue: number) => {
	if (!cycleInfo.enabled) Lighting.ClockTime = newValue;
};

export const Cycle = (newValue: number) => (cycleInfo.cycleRate = newValue);

export const CycleEnabled = (newValue: boolean) => (cycleInfo.enabled = newValue);

// SOUND
const sound = new Instance("Sound", Players.LocalPlayer);

export const SoundID = (newValue: number) => (sound.SoundId = `rbxassetid://${newValue}`);

export const Volume = (newValue: number) => (sound.Volume = newValue);

export const Pitch = (newValue: number) => {
	const pitchModifier = sound.FindFirstChildOfClass("PitchShiftSoundEffect")
		? (sound.FindFirstChildOfClass("PitchShiftSoundEffect") as PitchShiftSoundEffect)
		: new Instance("PitchShiftSoundEffect", sound);
	if (newValue === 0) pitchModifier.Enabled = false;
	else pitchModifier.Enabled = true;
	pitchModifier.Octave = newValue / 80;
};

export const IsPlaying = (newValue: boolean) => (newValue ? sound.Resume() : sound.Pause());

// CHARACTERS
const client = Players.LocalPlayer;

export const ResetEnabled = (newValue: boolean) => StarterGui.SetCore("ResetButtonCallback", newValue);

export const DefaultWalkSpeed = (newValue: number) => {
	const character = client.Character ?? client.CharacterAdded.Wait()[0];
	const humanoid = character.FindFirstChildOfClass("Humanoid");
	if (humanoid) {
		humanoid.WalkSpeed = newValue;
	}
};

export const DefaultJumpPower = (newValue: number) => {
	const character = client.Character ?? client.CharacterAdded.Wait()[0];
	const humanoid = character.FindFirstChildOfClass("Humanoid");
	if (humanoid) {
		humanoid.JumpPower = newValue;
	}
};

export const MinCameraZoom = (newValue: number) => (client.CameraMinZoomDistance = newValue);

export const MaxCameraZoom = (newValue: number) => (client.CameraMaxZoomDistance = newValue);
