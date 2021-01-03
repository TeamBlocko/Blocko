import { ReplicatedStorage } from "@rbxts/services";
import Serializer from "./Serializer";
import { BlockIds } from "./BlockIds";

type BlockName = keyof typeof BlockIds;

const shapes = ReplicatedStorage.BlockTypes;

class BlocksSerializer extends Serializer {
	public allowedProperties: [keyof RawProperties | "Position" | "Orientation", unknown][] = [
		["Material", "EnumItem"],
		["Position", "Vector3"],
		["Orientation", "Vector3"],
		["Anchored", "boolean"],
		["CastShadow", "boolean"],
		["Size", "Vector3"],
		["Transparency", "number"],
		["Reflectance", "number"],
		["Color", "Color3"],
	];

	getIdByName(name: BlockName): string {
		return BlockIds[name];
	}

	getNameById(id: BlockName): string {
		return BlockIds[id];
	}

	serializeBlocks(value: BasePart[]): string {
		const serialized: string[] = [];
		for (const part of value) {
			const serializedProperties: string[] = [];

			serializedProperties.push(this.getIdByName(part.Name as BlockName));
			for (const propertyInfo of this.allowedProperties) {
				const propertyValue = part[propertyInfo[0]];
				serializedProperties.push(this.serialize(propertyValue));
			}
			serialized.push(serializedProperties.join(";"));
		}
		return serialized.join("!");
	}

	deserializeBlocks(value: string, parent: Instance) {
		const blockInfos = value.split("!");

		for (const blockInfo of blockInfos) {
			const propertiesInfo = blockInfo.split(";");
			const id = this.getNameById(propertiesInfo.shift() as BlockName) as keyof typeof Shapes;
			const block = shapes[id].Clone();

			for (let index = 0; index < this.allowedProperties.size(); index++) {
				const [propertyName, type] = this.allowedProperties[index];
				const propertyValue = this.deserialize(propertiesInfo[index], type);
				block[propertyName] = propertyValue as never;
			}

			block.Parent = parent;
		}
	}
}

export default BlocksSerializer;
