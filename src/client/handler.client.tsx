import main from "./main.story";

const playerGui = game.GetService("Players").LocalPlayer.FindFirstChildOfClass("PlayerGui") as PlayerGui;

const screenGui = new Instance("ScreenGui", playerGui);

main(screenGui);
