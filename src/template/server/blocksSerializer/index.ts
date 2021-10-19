import Serializer from "template/shared/Serializer";
import * as FunctionalityHandler from "template/server/placementHandler/FunctionalitiesHandler";
import * as Functionality from "template/shared/Functionalities";
import { values, assign } from "@rbxts/object-utils";
import LZW from "./LZW";

class BlocksSerializer<T extends { [k: string]: string }> extends Serializer {
	// Add New properties at the end
	public allowedProperties: [keyof RawProperties | "Position" | "Orientation", string][] = [
		["Material", "EnumItem"],
		["Position", "Vector3"],
		["Orientation", "Vector3"],
		["CastShadow", "boolean"],
		["Size", "Vector3"],
		["Transparency", "number"],
		["Reflectance", "number"],
		["Color", "Color3"],
		["CanCollide", "boolean"],
	];

	public readonly blockIds: T;
	public readonly shapes: Folder & { [K in keyof T]: BasePart };

	/**
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
				const propertyValue =
					propertyName !== "Size"
						? part[propertyName]
						: part.FindFirstChildOfClass("Vector3Value")?.Value ?? part[propertyName];
				serializedProperties.push(this.serialize(propertyValue));
			}

			const functionalityFolder = part.FindFirstChild("Functionalities");
			if (functionalityFolder) {
				for (const functionality of functionalityFolder.GetChildren() as (BasePart & {
					Name: keyof Functionality.Functionalities;
				})[]) {
					const currentFunctionality = Functionality.functionalities[functionality.Name];
					const propertiesInfo = (
						functionality.GetChildren() as (ValueBase & {
							Name: keyof Functionality.IntersectionProperties;
						})[]
					).map(
						(instance) =>
							`${
								(currentFunctionality.Properties as Functionality.IntersectionProperties)[instance.Name]
									.Id
							}:${this.serialize(instance.Value)}`,
					);
					serializedProperties.push(`${currentFunctionality.Id}|${propertiesInfo.join("|")}`);
				}
			}
			serialized.push(serializedProperties.join(";"));
		}
		return LZW.Compress(serialized.join("!"), false);
	}

	/**
	 * In Use Chars: `,` `!` `;` `|` `:` `Numbers` `Letters`
	 *
	 * Blocks are seperated by `!`
	 *
	 * Block Properties are seperated by `;`
	 *
	 * Block Properties are Properties Followed by Functionality
	 *
	 * Properties start of with `Id`` of Block then followed by taking order of properties in `allowedProperties`
	 *
	 * Functionality Info are seperated by `|`
	 *
	 * Properties of Functionality are seperated by `:`
	 *
	 */
	deserializeBlocks(value: string, parent: Instance) {
		const blockInfos = LZW.Decompress(value, false).split("!");

		for (const blockInfo of blockInfos) {
			const propertiesInfo = blockInfo.split(";");
			const partId = propertiesInfo.shift();
			if (partId === undefined) return;

			const id = this.getNameById(partId);
			const block = this.shapes[id].Clone();

			for (const [propertyName, propertyType] of this.allowedProperties) {
				const value = propertiesInfo.shift();
				assert(value);

				const propertyValue = this.deserialize(value, propertyType);
				if (propertyName === "Size") {
					const actualSize = new Instance("Vector3Value", block);
					actualSize.Value = propertyValue as Vector3;
					actualSize.Name = "ActualSize";
				}
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
						Current: this.deserialize(propertyInfo[1], property.ValueType),
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
