import { Middleware, Store } from "@rbxts/rodux";

interface ReplicateFunc {
	(action: WorldSettingsActionTypes, nextState: WorldInfo, prevState: WorldInfo): void;
}

export const networkMiddlewareInitlizer: (replicate: ReplicateFunc) => Middleware = (replicate) => (
	nextDispatch,
	store: Store<WorldInfo>,
) => (action) => {
	const beforeState = store.getState();
	const result = nextDispatch(action);
	const afterState = store.getState();

	replicate(action, beforeState, afterState);

	return result;
};
