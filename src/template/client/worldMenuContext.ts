import { createContext } from "@rbxts/roact";

export interface ContextType {
	visible: boolean;
	updateWorldMenu: (visibality: boolean) => void;
}

export const worldMenuContext = createContext<ContextType>({
	visible: false,
	updateWorldMenu: (_visibality) => {},
});
