import { FunctionalitiesInstances } from "shared/Functionalities";

export interface IState {
	PlacementSettings: PlacementSettings;
	World: World;
}

export interface PlacementSettings {
	Shape: BasePart;
	BuildMode: BuildMode;
	RawProperties: RawProperties;
	Functionalities: FunctionalitiesInstances[];
}
