import Roact from "@rbxts/roact";
import { TopFrame } from "./TopFrame";
import { BottomFrame } from "./BottomFrame";

export function MainPage(props: { World: World }) {
	return (
		<frame AnchorPoint={new Vector2(0.5, 0.5)} BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)}>
			<TopFrame World={props.World} />
			<BottomFrame World={props.World} />
		</frame>
	);
}
