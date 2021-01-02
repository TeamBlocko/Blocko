import Serializer from "./Serializer";

type BlockIds = { [K: string]: string };

class BlocksSerializer extends Serializer {
	public readonly blockIds: BlockIds;
	public allowedProperties: (keyof BasePart)[] = [
		"Material",
		"Position",
		"Orientation",
		"Anchored",
		"CastShadow",
		"Size",
		"Transparency",
		"Reflectance",
		"Color",
	];

	constructor(blockIds: BlockIds) {
		super();
		this.blockIds = blockIds;
	}

	getIdByName(name: string): string {
		return this.blockIds[name];
	}

	serializeBlocks<T extends BasePart[]>(value: T): string {
		const serialized: string[] = [];
		for (const part of value) {
			serialized.push(this.getIdByName(part.Name));

			const serializedProperties: string[] = [];
			for (const property of this.allowedProperties) {
				const propertyValue = part[property];
				serializedProperties.push(this.serialize(propertyValue));
			}
			serialized.push(serializedProperties.join(";"));
		}
		return serialized.join("!");
	}
}

export default BlocksSerializer;
