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
			return `${this.serialize(value.r, 3)},${this.serialize(value.g, 3)},${this.serialize(value.b, 3)}`;
		} else if (typeIs(value, "Vector3")) {
			return `${value.X},${value.Y},${value.Z}`;
		} else {
			warn(`No implmented serializer for value of type ${typeOf(value)}`);
			return tostring(value);
		}
	}

	protected deserialize(value: string, type: "string"): string;
	protected deserialize(value: string, type: "number"): number;
	protected deserialize(value: string, type: "EnumItem"): EnumItem;
	protected deserialize(value: string, type: "Color3"): Color3;
	protected deserialize(value: string, type: "Vector3"): Vector3;
	protected deserialize(value: string, type: unknown): unknown;

	protected deserialize(value: string, type: unknown): unknown {
		if (type === "string") {
			return value;
		} else if (type === "number") {
			return tonumber(value);
		} else if (type === "boolean") {
			return value === "1" ? true : false;
		} else if (type === "EnumItem") {
			return value;
		} else if (type === "Color3") {
			return new Color3(...value.split(",").map((value) => tonumber(value) as number));
		} else if (type === "Vector3") {
			return new Vector3(...value.split(",").map((value) => tonumber(value) as number));
		} else {
			warn(`No implmented deserializer for value of type ${type}`);
			return value;
		}
	}
}

export default Serializer;
