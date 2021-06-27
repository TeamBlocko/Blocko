import { color3ToHex, hexToColor3 } from "template/shared/utility";

class Serializer {
	protected serialize(value: string): string;
	protected serialize(value: number, decimalPlace?: number): string;
	protected serialize(value: EnumItem): string;
	protected serialize(value: Color3): string;
	protected serialize(value: Vector3): string;
	protected serialize(value: unknown): string;

	protected serialize(value: unknown, secondParam?: unknown): string {
		if (typeIs(value, "string")) {
			return value;
		} else if (typeIs(value, "number") && (typeIs(secondParam, "number") || typeIs(secondParam, "nil"))) {
			return secondParam !== undefined ? `%.${secondParam}f`.format(value) : tostring(value);
		} else if (typeIs(value, "boolean")) {
			return value ? "1" : "0";
		} else if (typeIs(value, "EnumItem")) {
			return `${value.Value}`;
		} else if (typeIs(value, "Color3")) {
			return color3ToHex(value);
		} else if (typeIs(value, "Vector3")) {
			return `${value.X},${value.Y},${value.Z}`;
		} else {
			warn(`No implmented serializer for value of type ${typeOf(value)}`);
			return tostring(value);
		}
	}

	protected deserialize(value: string, valueType: "string"): string;
	protected deserialize(value: string, valueType: "number"): number;
	protected deserialize(value: string, valueType: "EnumItem"): EnumItem;
	protected deserialize(value: string, valueType: "Color3"): Color3;
	protected deserialize(value: string, valueType: "Vector3"): Vector3;
	protected deserialize(value: string, valueType: "NormalId"): Enum.NormalId;
	protected deserialize(value: string, valueType: unknown): unknown;

	protected deserialize(value: string, valueType: unknown): unknown {
		if (valueType === "string") {
			return value;
		} else if (valueType === "number") {
			return tonumber(value);
		} else if (valueType === "boolean") {
			return value === "1" ? true : false;
		} else if (valueType === "EnumItem") {
			return value;
		} else if (valueType === "Color3") {
			return hexToColor3(value);
		} else if (valueType === "Vector3") {
			return new Vector3(...value.split(",").map((value) => tonumber(value) as number));
		} else if (valueType === "NormalId") {
			return Enum.NormalId.GetEnumItems().find((vector) => this.serialize(Vector3.FromNormalId(vector)) === value) ?? Enum.NormalId.Front
		} else {
			warn(`No implmented deserializer for value of type ${valueType}`);
			return value;
		}
	}
}

export default Serializer;
