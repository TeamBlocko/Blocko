import { values } from "@rbxts/object-utils";
import store from "client/store";
import { functionalities } from "shared/Functionalities";

export function getAvliableFunctionalities() {
	const currentFunctionalities = store.getState().PlacementSettings.Functionalities

	return values(functionalities).filter(functionality => 
		functionality.Multiple || currentFunctionalities.find(addedFunctionality => functionality.Name === addedFunctionality.Name) === undefined
	)
}