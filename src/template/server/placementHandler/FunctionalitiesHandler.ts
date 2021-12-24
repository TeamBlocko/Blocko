import { Players } from "@rbxts/services";
import { values } from "@rbxts/object-utils";
import * as Functionalities from "template/shared/Functionalities";

const debounce = new Map<string, Map<number, number>>();

function setGet<T, V>(map: Map<T, V>, key: T, value: V): V {
	const currentValue = map.get(key);
	if (currentValue) {
		return currentValue;
	} else {
		map.set(key, value);
		return value;
	}
}

function addDamager(part: BasePart, functionality: Functionalities.FunctionalitiesInstancesValues) {
	if (functionality.Name === "Damager") {
		part.Touched.Connect((touchingPart) => {
			const player = Players.GetPlayerFromCharacter(touchingPart.Parent);
			const character = player?.Character;
			const humanoid = character?.FindFirstChildOfClass("Humanoid");

			if (!player || !humanoid || !character) return;
			const functionalityDebounce = setGet(debounce, functionality.GUID, new Map());
			const time = functionalityDebounce.get(player.UserId);

			if (time === undefined || os.time() - time > functionality.Properties.Cooldown.Current) {
				if (humanoid !== undefined) {
					humanoid.TakeDamage(functionality.Properties.Damage.Current);

					functionalityDebounce.set(player.UserId, os.time());
				}
			}
		});
	}
}

function addTripper(part: BasePart) {
	part.Touched.Connect((object) => {
		const humanoid = object.Parent?.FindFirstChildOfClass("Humanoid");
		if (humanoid) {
			humanoid.Sit = true;
		}
	});
}

function addConveyor(part: BasePart, functionality: Functionalities.FunctionalitiesInstancesValues) {
	if (functionality.Name === "Conveyor") {
		part.Touched.Connect((otherPart) => {
			const character = otherPart.Parent;
			const humanoidRootPart = character?.FindFirstChild("HumanoidRootPart") as BasePart;
			if (!humanoidRootPart) return;
			part.AssemblyLinearVelocity = Vector3.FromNormalId(functionality.Properties.Direction.Current).mul(
				functionality.Properties.Speed.Current,
			);
		});
	}
}

function addGearGiver(part: BasePart, functionality: Functionalities.FunctionalitiesInstancesValues) {
	print("GEAR GIVER", functionality.Name);
	if (functionality.Name === "GearGiver") {
		part.Touched.Connect(object => {
			const id = functionality.Properties.ItemId.Current
			const result = opcall(() => game.GetService("InsertService").LoadAsset(id).GetChildren()[0]);
			if (!result.success) return;
			const item = result.value;
			item.Name = tostring(id);
			const player = game.GetService("Players").GetPlayerFromCharacter(object.Parent);
			const character = player?.Character;
			const backpack = player?.FindFirstChildOfClass("Backpack");
			print(character, backpack);
			if (character && character.FindFirstChild(tostring(id))) return;
			if (!backpack || backpack.FindFirstChild(tostring(id))) return;
			const newItem = item.Clone();
			newItem.Parent = backpack;
		})
	}
}

function addTeleporter(part: BasePart, functionality: Functionalities.FunctionalitiesInstancesValues) {
	print("TELEPORTER", functionality.Name);
	if (functionality.Name === "Teleporter") {
		part.Touched.Connect((object) => {
			let humanoidRootPart = object.Parent?.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
			const targetId = functionality.Properties.Target.Current;
			print(targetId);
			if (!humanoidRootPart || !targetId) return;
			const target = game.GetService("Workspace").Blocks.FindFirstChild(targetId) as BasePart | undefined;
			print(target);
			if (!target) return;
			humanoidRootPart.CFrame = target.CFrame.add(new Vector3(0, target.Size.Y, 0));
		});
	}
}

export function addFunctionality(part: BasePart, functionality: Functionalities.FunctionalitiesInstancesValues) {
	switch (functionality.Name) {
		case "Damager":
			addDamager(part, functionality);
			break;
		case "Tripper":
			addTripper(part);
			break;
		case "Conveyor":
			addConveyor(part, functionality);
			break;
		case "GearGiver":
			addGearGiver(part, functionality);
			break;
		case "Teleporter": 
			addTeleporter(part, functionality);
			break;
	}
}

function createValueInstance(value: Functionalities.FunctionalitiesPropertiesInstance, parent: Folder) {
	switch (value.ValueType) {
		case "number": {
			const valueInstance = new Instance("NumberValue");
			valueInstance.Value = value.Current;
			valueInstance.Name = value.Name;
			valueInstance.Parent = parent;
			return;
		}
		case "NormalId": {
			const valueInstance = new Instance("Vector3Value");
			valueInstance.Value = Vector3.FromNormalId(value.Current);
			valueInstance.Name = value.Name;
			valueInstance.Parent = parent;
			return;
		} case "Object": {
			const valueInstance = new Instance("StringValue");
			valueInstance.Value = value.Current ?? "";
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
