import { createContext } from "@rbxts/roact";

export interface ContextType {
	OpenDropdown?: string
	changeDropdown: (newDropdown: string | undefined) => void
}

export const appContext = createContext<ContextType>({
	changeDropdown: (newDropdown) => {}
})