class Serializer {
	serialize(value: string): string;
	serialize(value: number, decimalPlace?: number): string;
	serialize(value: EnumItem): string;
	serialize(value: Color3): string;
	serialize(value: Vector3): string;
	serialize(value: unknown): string;

	serialize(value: unknown, secondParam?: unknown): string {
		if (typeIs(value, "string")) {
			return value;
		} else if (typeIs(value, "number") && (typeIs(secondParam, "number") || typeIs(secondParam, "nil"))) {
			return secondParam !== undefined ? `%.${secondParam}f`.format(value) : tostring(value);
		} else if (typeIs(value, "EnumItem")) {
			return `${tostring(value.EnumType)}:${value.Value}`;
		} else if (typeIs(value, "Color3")) {
			return `${this.serialize(value.r, 3)},${this.serialize(value.g, 3)},${this.serialize(value.b, 3)}`;
		} else if (typeIs(value, "Vector3")) {
			return `${value.X},${value.Y},${value.Z}`;
		} else {
			warn(`No implmented serializer for value of type ${value}`);
			return tostring(value);
		}
	}
}

export default Serializer;
