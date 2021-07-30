import { createContext } from "@rbxts/roact";

export interface Popup {
	name: "Create" | "World" | "Rules";
	id: number;
}

export interface ContextType {
	OpenPopup?: Popup;
	changePopup: (newDropdown: Popup | undefined) => void;
}

export const popupFrameContext = createContext<ContextType>({
	changePopup: (_newDropdown) => {},
});
