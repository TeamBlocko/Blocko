import { assign } from "@rbxts/object-utils";

export const map = (value: number, x1: number, y1: number, x2: number, y2: number): number =>
	((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

export const inverseColor = (color: Color3): Color3 => new Color3(1 - color.r, 1 - color.g, 1 - color.b);

export function getPosOnAxis(v1: Vector2, v2: Vector2, dist: number): Vector2 {
	const deltaX = v1.X - v2.X;
	const deltaY = v1.Y - v2.Y;

	const radian = math.atan2(deltaY, deltaX);

	const X = math.cos(radian) * dist;
	const Y = math.sin(radian) * dist;

	return v1.add(new Vector2(X, Y));
}

const DEFAULT_OPTIONS = {
	decimalPlace: 2,
};

export function validateText(text: string, options?: ValidateTextOptions) {
	const optionsUsed = assign(DEFAULT_OPTIONS, options);

	if (text === "") return;

	let value = tonumber(text);
	if (text.match("[%d%.]+")[0] !== text && value === undefined) {
		const [result] = text.gsub("[%d%.]+", "");
		[text] = text.gsub(`${result}`, "");
		value = tonumber(text);
	}
	if (optionsUsed.Range) {
		if (value !== undefined && (value > optionsUsed.Range.Min || value < optionsUsed.Range.Max)) {
			text = tostring(math.clamp(value, optionsUsed.Range.Min, optionsUsed.Range.Max));
			value = tonumber(text);
		}
	}
	if (value === undefined) return;
	const [, decimal] = math.modf(value);
	const pattern = decimal === 0 ? "%.0f" : `%.${optionsUsed.decimalPlace}f`;
	return tonumber(pattern.format(text));
}

export function previousInTable<T>(t: T[], element: T): T {
	return t[(t.indexOf(element) - 1) % t.size()];
}

export function nextInTable<T>(t: T[], element: T): T {
	return t[(t.indexOf(element) + 1) % t.size()];
}

export function shallowEqual(t1: object, t2: object) {
	for (const [key, value] of pairs(t1)) {
		if (key in t2) {
			if (typeOf(value) === "number" && typeOf(t2[key]) === "number") {
				if ("%.2f".format(value) !== "%.2f".format(t2[key])) {
					return false
				}
			} else {
				if (value !== t2[key]) {
					return false
				}
			}
		} else {
			return false
		}
	}

	return true
}