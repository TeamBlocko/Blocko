import store from "./store";
import * as handlers from "shared/worldSettingsHandler";

function updateSettings(state: WorldSettings) {
	for (const [propertyName, value] of pairs(state)) {
		if (propertyName in handlers)
			handlers[propertyName as keyof typeof handlers](value as any)
	}
}

updateSettings(store.getState().WorldSettings)
store.changed.connect((newState) => updateSettings(newState.WorldSettings))
