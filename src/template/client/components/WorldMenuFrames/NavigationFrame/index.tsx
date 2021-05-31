import { Players, TeleportService } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import ElementSeperator from "template/client/components/misc/ElementSperator";
import NavFrameButton from "./NavFrameButton";
import Thumbnail from "template/client/components/misc/Thumbnail";
import Container from "../WorldMenuFramesContainer";
import { IState } from "template/shared/Types";

function NavigationFrame(props: WorldMenuFrames & WorldInfo) {
	return (
		<Container RefValue={props.RefValue}>
			<uicorner />
			<Thumbnail Position={UDim2.fromScale(0.5, 0)} />
			<frame
				AnchorPoint={new Vector2(0, 1)}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0, 1)}
				Size={new UDim2(1, 0, 1, -180)}
			>
				<NavFrameButton
					Text="World Info"
					Color={Color3.fromRGB(235, 235, 236)}
					Icon="rbxassetid://5627702525"
					OnClick={(e) => props.OnClick(e)}
				/>
				{props.Owner === Players.LocalPlayer.UserId ? (
					<>
						<NavFrameButton
							Text="World Settings"
							Color={Color3.fromRGB(235, 235, 236)}
							Icon="rbxassetid://5627731849"
							OnClick={(e) => props.OnClick(e)}
						/>
					</>
				) : undefined}
				<NavFrameButton
					Text="Permissions"
					Color={Color3.fromRGB(235, 235, 236)}
					Icon="rbxassetid://5627731849"
					OnClick={(e) => props.OnClick(e)}
				/>
				<ElementSeperator />
				<NavFrameButton
					Text="Back To Hub"
					Color={Color3.fromRGB(200, 74, 74)}
					Icon="rbxassetid://5627768153"
					OnClick={() => TeleportService.Teleport(5102036961, Players.LocalPlayer)}
				/>
				<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} />
			</frame>
		</Container>
	);
}

export default connect((state: IState) => state.World.Info)(NavigationFrame);
