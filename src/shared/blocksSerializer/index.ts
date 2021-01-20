import Serializer from "shared/Serializer";

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

			block.Anchored = true;
			block.Parent = parent;
		}
	}
}

export default BlocksSerializer;
