import { Middleware, Store } from "@rbxts/rodux";

interface ReplicateFunc {
	(action: ActionRecievedUpdateWorldSettings, nextState: WorldSettings, prevState: WorldSettings): void;
}

export const networkMiddlewareInitlizer: (replicate: ReplicateFunc) => Middleware = (replicate) => (
	nextDispatch,
	store: Store<WorldSettings>,
) => (action) => {
	const beforeState = store.getState();
	const result = nextDispatch(action);
	const afterState = store.getState();

	replicate(action, beforeState, afterState);

	return result;
};
