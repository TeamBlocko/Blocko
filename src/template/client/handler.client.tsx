import { StarterGui } from "@rbxts/services";
import Roact from "@rbxts/roact";
import MainUI from "./components/MainUI";

const playerGui = game.GetService("Players").LocalPlayer.FindFirstChildOfClass("PlayerGui") as PlayerGui;

StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.PlayerList, false)
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.EmotesMenu, false)
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false)
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Health, false)

Roact.mount(<MainUI />, playerGui);
