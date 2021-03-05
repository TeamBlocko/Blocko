import store from "client/store";
import functionalities from "./Functionalities";

export function getAvliableFunctionalities() {
	const currentFunctionalities = store.getState().PlacementSettings.Functionalities

	return functionalities.filter(functionality => 
		functionality.Multiple || currentFunctionalities.find(addedFunctionality => functionality.Name === addedFunctionality.Name) === undefined
	)
}