import Serializer from "shared/Serializer";
import * as FunctionalityHandler from "server/placementHandler/FunctionalitiesHandler";
import * as Functionality from "shared/Functionalities";
import { values, assign } from "@rbxts/object-utils";

class BlocksSerializer<T extends { [k: string]: string }> extends Serializer {
	public allowedProperties: [keyof RawProperties | "Position" | "Orientation", unknown][] = [
		["Material", "EnumItem"],
		["Position", "Vector3"],
		["Orientation", "Vector3"],
		["CastShadow", "boolean"],
		["Size", "Vector3"],
		["Transparency", "number"],
		["Reflectance", "number"],
		["Color", "Color3"],
	];

	public readonly blockIds: T;
	public readonly shapes: Folder & { [K in keyof T]: BasePart };

	/**
	 * @param blockIds An enum containing BlockNames and their Id
	 * @param blockIds An enum containing BlockNames and their Id
	 * @param shapes folder of BaseParts to be used when deserializing, parts should be named as in blockIds
	 */
	constructor(blockIds: T, shapes: Folder & { [K in keyof T]: BasePart }) {
		super();

		this.blockIds = blockIds;
		this.shapes = shapes;
	}

	getIdByName(name: string): string {
		return this.blockIds[name];
	}

	getNameById(id: string): string {
		return this.blockIds[id];
	}

	serializeBlocks(value: BasePart[]): string {
		const serialized: string[] = [];
		for (const part of value) {
			const serializedProperties: string[] = [];

			serializedProperties.push(this.getIdByName(part.Name));
			for (const [propertyName] of this.allowedProperties) {
				const propertyValue = part[propertyName];
				serializedProperties.push(this.serialize(propertyValue));
			}

			const functionalityFolder = part.FindFirstChild("Functionalities");
			print(functionalityFolder);
			if (functionalityFolder) {
				for (const functionality of functionalityFolder.GetChildren() as (BasePart & {
					Name: keyof Functionality.Functionalities;
				})[]) {
					const currentFunctionality = Functionality.functionalities[functionality.Name];
					const propertiesInfo = (functionality.GetChildren() as (ValueBase & {
						Name: keyof Functionality.IntersectionProperties;
					})[]).map(
						(instance) =>
							`${
								(currentFunctionality.Properties as Functionality.IntersectionProperties)[instance.Name]
									.Id
							}:${instance.Value}`,
					);
					print(`${currentFunctionality.Id}|${propertiesInfo.join("|")}`);
					serializedProperties.push(`${currentFunctionality.Id}|${propertiesInfo.join("|")}`);
				}
			}
			serialized.push(serializedProperties.join(";"));
		}
		return serialized.join("!");
	}

	deserializeBlocks(value: string, parent: Instance) {
		const blockInfos = value.split("!");

		for (const blockInfo of blockInfos) {
			const propertiesInfo = blockInfo.split(";");
			const partId = propertiesInfo.shift();
			if (partId === undefined) return;

			const id = this.getNameById(partId);
			const block = this.shapes[id].Clone();

			for (const [propertyName, type] of this.allowedProperties) {
				const value = propertiesInfo.shift();
				assert(value);
				const propertyValue = this.deserialize(value, type);
				block[propertyName] = propertyValue as never;
			}

			const blockFunctionalities = propertiesInfo.mapFiltered((functionalityInfo) => {
				const info = functionalityInfo.split("|");
				const functionalityId = info.shift();
				const currentFunctionality = values(Functionality.functionalities).find(
					(functionality) => functionality.Id === functionalityId,
				);
				if (!currentFunctionality) return undefined;

				const functionality = Functionality.createFunctionality(currentFunctionality);

				for (const propertyUnparsed of info) {
					const propertyInfo = propertyUnparsed.split(":");
					const property = values(
						currentFunctionality.Properties as Functionality.FunctionalitiesPropertiesValues[],
					).find((property) => property.Id === propertyInfo[0]);
					if (!property) continue;
					assign((functionality.Properties as Functionality.IntersectionProperties)[property.Name], {
						Current: tonumber(propertiesInfo[1]),
					});
				}

				return functionality;
			});

			FunctionalityHandler.addPart(block, blockFunctionalities);

			block.Anchored = true;
			block.Parent = parent;
		}
	}
}

export default BlocksSerializer;
