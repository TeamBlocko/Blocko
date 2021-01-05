import WorldManager from "./WorldManager";

game.BindToClose(() => {
	WorldManager.Save();
});

while (true) {
	wait(10);
	WorldManager.Save();
}
