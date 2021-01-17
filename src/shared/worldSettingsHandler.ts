import { Lighting } from "@rbxts/services";

export const Brightness = (newValue: number) => {
	Lighting.Brightness = newValue;
};
