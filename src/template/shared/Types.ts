import { FunctionalitiesInstancesValues } from "template/shared/Functionalities";

export interface IState {
	ActivatedPicker?: string;
	PlacementSettings: PlacementSettings;
	Debug: boolean;
	World: World;
}

export interface PlacementSettings {
	Shape: BasePart;
	BuildMode: BuildMode;
	RawProperties: RawProperties;
	Functionalities: FunctionalitiesInstancesValues[];
}
