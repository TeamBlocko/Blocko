import { t } from "@rbxts/t";
import Serializer from "shared/Serializer";

class WorldInfoSerializer extends Serializer {
	serializeInfo(info: WorldInfo | WorldSettings): SerializedWorldInfo {
		const result = {};

		for (const [property, value] of pairs(info)) {
			if (typeIs(value, "table")) result[property] = this.serializeInfo(value) as never;
			else result[property] = [this.serialize(value), typeOf(value)] as never;
		}
		print("SERIALIZE", result);
		return result as SerializedWorldInfo;
	}

	deserializeInfo(info: object): WorldInfo {
		const result = {};

		for (const [property, value] of pairs(info)) {
			if (t.array(t.string)(value)) result[property] = this.deserialize(value[0], value[1]) as never;
			else result[property] = this.deserializeInfo(value) as never;
		}
		return result as WorldInfo;
	}
}

export default WorldInfoSerializer;
