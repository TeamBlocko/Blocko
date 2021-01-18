import { Lighting, RunService, Players } from "@rbxts/services";
import store from "./store";

// LIGHTING
export const Brightness = (newValue: number) => Lighting.Brightness = newValue;

export const Ambient = (newValue: Color3) => Lighting.Ambient = newValue;

export const OutdoorAmbient = (newValue: Color3) => Lighting.OutdoorAmbient = newValue;

const intialState = store.getState().WorldSettings
const cycleInfo = { cycleRate: intialState.Cycle, enabled: intialState.CycleEnabled }
RunService.RenderStepped.Connect(() => {
	if (cycleInfo.enabled)
		Lighting.SetMinutesAfterMidnight(Lighting.GetMinutesAfterMidnight() + cycleInfo.cycleRate)
})

export const Time = (newValue: number) => {if (!cycleInfo.enabled) Lighting.ClockTime = newValue};

export const Cycle = (newValue: number) => cycleInfo.cycleRate = newValue;

export const CycleEnabled = (newValue: boolean) => cycleInfo.enabled = newValue;

// SOUND
const sound = new Instance("Sound", Players.LocalPlayer);

export const SoundID = (newValue: number) => sound.SoundId = `rbxassetid://${newValue}`;

export const Volume = (newValue: number) => sound.Volume = newValue;

export const Pitch = (newValue: number) => {
	const pitchModifier = sound.FindFirstChildOfClass("PitchShiftSoundEffect")
		? sound.FindFirstChildOfClass("PitchShiftSoundEffect") as PitchShiftSoundEffect
		: new Instance("PitchShiftSoundEffect", sound);
	if (newValue === 0)
		pitchModifier.Enabled = false;
	else
		pitchModifier.Enabled = true;
		pitchModifier.Octave = newValue/80
}

export const IsPlaying = (newValue: boolean) => newValue ? sound.Resume() : sound.Pause();