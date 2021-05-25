import Roact from "@rbxts/roact";
import { Client } from "@rbxts/net";
import WorldCover from "./WorldCover";
import WorldInfo from "./WorldInfo";

const teleportPlayer = new Client.AsyncFunction<[], [number]>("TeleportPlayer")
teleportPlayer.SetCallTimeout(100)

function WorldFrame(props: World) {
	return (
		<imagebutton
			BackgroundTransparency={1}
			Selectable={false}
			Size={UDim2.fromOffset(100, 100)}
			AutoButtonColor={false}
			Image={"rbxassetid://5403617336"}
			ImageTransparency={1}
			ScaleType={Enum.ScaleType.Crop}
			Event={{
				Activated: () => teleportPlayer.CallServerAsync(props.Info.WorldId)
			}}
		>
			<uiscale />
			<uiaspectratioconstraint AspectRatio={1.5527461767197} />
			<WorldInfo {...props} />
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
				Image={"rbxassetid://6406939496"}
				ImageColor3={new Color3()}
				ImageTransparency={0.2}
				ZIndex={0}
			>
				<uicorner CornerRadius={new UDim(0.08, 0)} />
			</imagelabel>
			<WorldCover
				Image={"rbxassetid://3926305904"}
				ImageRectOffset={new Vector2(764, 844)}
				ImageRectSize={new Vector2(36, 36)}
			/>
			<WorldCover
				Image={"rbxassetid://3926305904"}
				ImageRectOffset={new Vector2(4, 684)}
				ImageRectSize={new Vector2(36, 36)}
				ImageTransparency={0.1}
			/>
			<uicorner CornerRadius={new UDim(0.08, 0)} />
		</imagebutton>
	);
}

export default WorldFrame;
