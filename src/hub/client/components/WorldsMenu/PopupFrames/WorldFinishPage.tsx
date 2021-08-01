import Roact from "@rbxts/roact";
import BottomFrame from "./BottomFrame";
import TopFrame from "./TopFrame";

interface WorldFinishPagePropTypes {
	FrameRef: Roact.Ref<Frame>;
	OnCreate: () => void;
	OnReturn: () => void;
}

function WorldFinishPage(props: WorldFinishPagePropTypes) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			ClipsDescendants={true}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			Ref={props.FrameRef}
		>
			<TopFrame
				Title={"Create World"}
				Description={"Are you sure you want to create a new world that costs 200 bits?"}
			/>
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.535)}
				Size={UDim2.fromScale(0.85, 0.5)}
				Image={"rbxassetid://6937187348"}
				ScaleType={Enum.ScaleType.Fit}
			/>
			<BottomFrame
				Button1Click={() => props.OnReturn()}
				Button1Text={"Return"}
				Button2Click={() => props.OnCreate()}
				Button2Text={"Create"}
			/>
		</frame>
	);
}

export default WorldFinishPage;
