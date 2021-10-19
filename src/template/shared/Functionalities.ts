import { assign, deepCopy, values } from "@rbxts/object-utils";
import { HttpService } from "@rbxts/services";

export const functionalities = {
	Damager: {
		Name: "Damager",
		Id: "1",
		Properties: {
			Damage: {
				Name: "Damage",
				Id: "1",
				Type: "slider",
				ValueType: "number",
				Default: 50,
				Min: 1,
				Max: 100,
			},
			Cooldown: {
				Name: "Cooldown",
				Id: "2",
				Type: "slider",
				ValueType: "number",
				Default: 1,
				Min: 1,
				Max: 10,
			},
		},
		Multiple: true,
	},
	Conveyor: {
		Name: "Conveyor",
		Id: "2",
		Properties: {
			Speed: {
				Name: "Speed",
				Id: "1",
				Type: "slider",
				ValueType: "number",
				Default: 1,
				Min: 1,
				Max: 100,
			},
			Direction: {
				Name: "Direction",
				Id: "2",
				Type: "choice",
				ValueType: "NormalId",
				Default: Enum.NormalId.Front,
				Items: Enum.NormalId.GetEnumItems(),
			},
		},
		Multiple: false,
	},
	Tripper: {
		Name: "Tripper",
		Id: "3",
		Properties: {},
		Multiple: false,
	},
	GearGiver: {
		Name: "GearGiver",
		Id: "4",
		Properties: {
			ItemId: {
				Name: "ItemId",
				Id: "1",
				Type: "input",
				ValueType: "number",
				Default: 0,
			},
		},
		Multiple: false,
	},
	Teleporter: {
		Name: "Teleporter",
		Id: "5",
		Properties: {
			Target: {
				Name: "Target",
				Id: "1",
				Type: "block",
				ValueType: "Object",
				Default: undefined,
			}
		},
		Multiple: true,
	}
} as const;

export type Functionalities = typeof functionalities;
export type FunctionalitiesValues = ValueOf<Functionalities>;
export type FunctionalitiesProperties = FunctionalitiesValues["Properties"];
export type IntersectionProperties = UnionToIntersection<FunctionalitiesProperties>;

export type FunctionalitiesPropertiesNames = keyof IntersectionProperties;
export type FunctionalitiesPropertiesValues = ValueOf<IntersectionProperties>;
export type FunctionalitiesPropertiesValueTypes = number | Enum.NormalId | undefined | string;

// Object being Object's id/name;
type MapType<T> = T extends "number"
	? number
	: T extends "NormalId"
	? Enum.NormalId
	: T extends "Object"
	? string | undefined
	: never;

export type FunctionalitiesInstances = {
	[K in keyof Functionalities]: Functionalities[K] & { GUID: string } & {
			[S in keyof UnionToIntersection<Functionalities[K]>]: S extends "Properties"
				? {
						[P in keyof UnionToIntersection<Functionalities[K]>[S]]: UnionToIntersection<Functionalities[K]>[S][P] & {
							// @ts-expect-error No Idea
							Current: MapType<UnionToIntersection<UnionToIntersection<Functionalities[K]>[S][P]>["ValueType"]>
						};
				  }
				: UnionToIntersection<Functionalities[K]>[S];
		};
};

export type FunctionalitiesInstancesValues = FunctionalitiesInstances[keyof Functionalities];

export type FunctionalitiesPropertiesInstance = {
	[K in keyof IntersectionProperties]: IntersectionProperties[K] & {
		Current: MapType<IntersectionProperties[K]["ValueType"]>;
	};
}[keyof IntersectionProperties];

export function createFunctionality(
	functionality: FunctionalitiesValues,
	options: { GUID?: string } = {},
): FunctionalitiesInstancesValues {
	const functionalityCopy = deepCopy(functionality);

	const newFunctionality = assign(functionalityCopy, {
		GUID: options.GUID ?? HttpService.GenerateGUID(false),
	});

	for (const property of values(newFunctionality.Properties) as FunctionalitiesPropertiesInstance[]) {
		assign(property, {
			Current: property.Default,
		});
	}

	return newFunctionality as FunctionalitiesInstancesValues;
}
