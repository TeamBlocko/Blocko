import { RunService, CollectionService, Players } from "@rbxts/services";
import { values } from "@rbxts/object-utils";
import * as Functionalities from "shared/Functionalities";

type ValueObjectClassNames = {
	[K in keyof Instances]: K extends `{infer U}Value` ? K : never;
}[keyof Instances];

function GetTouchingParts(part: BasePart) {
	const connection = part.Touched.Connect(() => {});
	const parts = part.GetTouchingParts();
	connection.Disconnect();
	return parts;
}

function addDamager(part: BasePart, properties: Functionalities.Functionalities["Damager"]["Properties"]) {
	CollectionService.AddTag(part, "Functionality");
}

function addTripper(part: BasePart, properties: Functionalities.Functionalities["Tripper"]["Properties"]) {
	part.Touched.Connect((object) => {
		const humanoid = object.Parent!.FindFirstChildOfClass("Humanoid");
		if (humanoid) {
			humanoid.Sit = true;
		}
	});
	CollectionService.AddTag(part, "Functionality");
}

function addConveyor(part: BasePart, properties: Functionalities.Functionalities["Conveyor"]["Properties"]) {
	CollectionService.AddTag(part, "Functionality");
}

export function addFunctionality(part: BasePart, functionality: Functionalities.FunctionalitiesInstances) {
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

export function addPart(part: BasePart, functionalities: Functionalities.FunctionalitiesInstances[]) {
	if (functionalities.size() === 0) return;

	const functionalityFolder = part.FindFirstChild("Functionalities") ?? new Instance("Folder", part);
	functionalityFolder.Name = "Functionalities";
	for (const functionality of functionalities) {
		const container = part.FindFirstChild(functionality.Name) ?? new Instance("Folder", functionalityFolder);
		container.Name = functionality.Name;

		for (const property of (values(
			functionality.Properties,
		) as unknown) as Functionalities.FunctionalitiesPropertiesInstance[]) {
			print(property);
			const [propertyInstanceType] = property.Type.gsub("^.", (s) => s.upper());
			const propertyValue: ValueBase = new Instance(
				`${propertyInstanceType}Value` as ValueObjectClassNames,
				container,
			);
			propertyValue.Value = property.Current;
			propertyValue.Name = property.Name;
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
}

type Functionality = Folder &
	(({ Name: "Damager" } & Damager) | ({ Name: "Conveyor" } & Conveyor) | { Name: "Tripper" });

RunService.Heartbeat.Connect(() => {
	for (const part of CollectionService.GetTagged("Functionality") as (BasePart & { Functionalities: Folder })[]) {
		for (const functionality of part.Functionalities.GetChildren() as Functionality[]) {
			if (functionality.Name === "Conveyor") {
				part.Velocity = part.CFrame.LookVector.mul(functionality.Speed.Value);
			} else {
				debounce.get(functionality) ?? debounce.set(functionality, new Map());

				for (const touchingPart of GetTouchingParts(part)) {
					const player = Players.GetPlayerFromCharacter(touchingPart.Parent);
					const humanoid = player?.Character?.FindFirstChildOfClass("Humanoid");

					if (!player || !humanoid) continue;

					if (functionality.Name === "Damager") {
						const time = debounce.get(functionality)!.get(player);

						if (time === undefined || os.time() - time > functionality.Cooldown.Value) {
							if (humanoid !== undefined) {
								print(`Gave ${functionality.Damage.Value} to ${player.Name}`);
								humanoid.TakeDamage(functionality.Damage.Value);

								debounce.get(functionality)!.set(player, os.time());
							}
						}
					} else if (functionality.Name === "Tripper") {
						humanoid.Sit = true;
					}
				}
			}
		}
	}
});
