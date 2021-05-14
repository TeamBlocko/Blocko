import Roact from "@rbxts/roact";
import MainUI from "./components/MainUI";

const playerGui = game.GetService("Players").LocalPlayer.FindFirstChildOfClass("PlayerGui") as PlayerGui;

Roact.mount(<MainUI />, playerGui);
