import { Middleware, Store } from "@rbxts/rodux";
import { WorldSettingsActionTypes } from "shared/worldSettingsReducer";

interface ReplicateFunc {
	(action: WorldSettingsActionTypes, nextState: World, prevState: World): void;
}

export const networkMiddlewareInitlizer: (replicate: ReplicateFunc) => Middleware = (replicate) => (
	nextDispatch,
	store: Store<World>,
) => (action) => {
	const beforeState = store.getState();
	const result = nextDispatch(action);
	const afterState = store.getState();

	replicate(action, beforeState, afterState);

	return result;
};
