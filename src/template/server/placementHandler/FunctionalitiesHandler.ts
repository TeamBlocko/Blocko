import { RunService, CollectionService, Players } from "@rbxts/services";
import { values } from "@rbxts/object-utils";
import * as Functionalities from "template/shared/Functionalities";

function GetTouchingParts(part: BasePart) {
	const connection = part.Touched.Connect(() => {});
	const parts = part.GetTouchingParts();
	connection.Disconnect();
	return parts;
}

function addDamager(part: BasePart, _properties: Functionalities.FunctionalitiesInstances["Damager"]["Properties"]) {
	CollectionService.AddTag(part, "Functionality");
}

function addTripper(part: BasePart, _properties: Functionalities.FunctionalitiesInstances["Tripper"]["Properties"]) {
	/*
	part.Touched.Connect((object) => {
		const humanoid = object.Parent!.FindFirstChildOfClass("Humanoid");
		if (humanoid) {
			humanoid.Sit = true;
		}
	});
	*/
	CollectionService.AddTag(part, "Functionality");
}

function addConveyor(part: BasePart, properties: Functionalities.FunctionalitiesInstances["Conveyor"]["Properties"]) {
	CollectionService.AddTag(part, "Functionality");
}

export function addFunctionality(part: BasePart, functionality: Functionalities.FunctionalitiesInstancesValues) {
	switch (functionality.Name) {
		case "Damager":
			addDamager(part, functionality.Properties);
			break;
		case "Tripper":
			addTripper(part, functionality.Properties);
			break;
		case "Conveyor":
			addConveyor(part, functionality.Properties);
			break;
	}
}

function createValueInstance(value: Functionalities.FunctionalitiesPropertiesInstance, parent: Folder) {
	switch (value.Type) {
		case "number":
			const valueInstance = new Instance("NumberValue");
			valueInstance.Value = value.Current;
			valueInstance.Name = value.Name;
			valueInstance.Parent = parent;
			break;
		case "choice":
			if (value.Name === "Direction") {
				const valueInstance = new Instance("Vector3Value");
				valueInstance.Value = Vector3.FromNormalId(value.Current);
				valueInstance.Name = value.Name;
				valueInstance.Parent = parent;
				break;
			}
	}
}

export function addPart(part: BasePart, functionalities: Functionalities.FunctionalitiesInstancesValues[]) {
	if (functionalities.size() === 0) return;

	const functionalityFolder = part.FindFirstChild("Functionalities") ?? new Instance("Folder", part);
	functionalityFolder.Name = "Functionalities";
	for (const functionality of functionalities) {
		const container =
			(part.FindFirstChild(functionality.Name) as Folder) ?? new Instance("Folder", functionalityFolder);
		container.Name = functionality.Name;

		for (const property of values(
			functionality.Properties,
		) as Functionalities.FunctionalitiesPropertiesInstance[]) {
			createValueInstance(property, container);
		}

		addFunctionality(part, functionality);
	}
}

const debounce = new Map<Folder, Map<Player, number>>();

export interface Damager {
	Damage: NumberValue;
	Cooldown: NumberValue;
}

export interface Conveyor {
	Speed: NumberValue;
	Direction: Vector3Value;
}

type Functionality = Folder &
	(({ Name: "Damager" } & Damager) | ({ Name: "Conveyor" } & Conveyor) | { Name: "Tripper" });

RunService.Heartbeat.Connect(() => {
	for (const part of CollectionService.GetTagged("Functionality") as (BasePart & { Functionalities: Folder })[]) {
		for (const functionality of part.Functionalities.GetChildren() as Functionality[]) {
			debounce.get(functionality) ?? debounce.set(functionality, new Map());

			for (const touchingPart of GetTouchingParts(part)) {
				const player = Players.GetPlayerFromCharacter(touchingPart.Parent);
				const character = player?.Character;
				const humanoid = character?.FindFirstChildOfClass("Humanoid");

				if (!player || !humanoid || !character) continue;

				if (functionality.Name === "Damager") {
					const time = debounce.get(functionality)!.get(player);

					if (time === undefined || os.time() - time > functionality.Cooldown.Value) {
						if (humanoid !== undefined) {
							humanoid.TakeDamage(functionality.Damage.Value);

							debounce.get(functionality)!.set(player, os.time());
						}
					}
				} else if (functionality.Name === "Tripper") {
					humanoid.Sit = true;
				} else if (functionality.Name === "Conveyor") {
					const humanoidRootPart = character.FindFirstChild("HumanoidRootPart") as BasePart;
					if (!humanoidRootPart) continue;
					part.AssemblyLinearVelocity = functionality.Direction.Value.mul(functionality.Speed.Value);
				}
			}
		}
	}
});
