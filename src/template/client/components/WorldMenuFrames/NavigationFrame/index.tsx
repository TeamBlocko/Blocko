import { Players, TeleportService } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import ElementSeperator from "template/client/components/misc/ElementSperator";
import NavFrameButton from "./NavFrameButton";
import Thumbnail from "template/client/components/misc/Thumbnail";
import Container from "../WorldMenuFramesContainer";
import { IState } from "template/shared/Types";
import { calculatePermissionsOfUser } from "template/shared/permissionsUtility";
import { deepEquals } from "@rbxts/object-utils";

interface NavigationFramePropTypes extends WorldMenuFrames, MappedProps {}

interface MappedProps {
	Owner: number;
	Permissions: PermissionsInfo[];
	Bans: number[];
}

class NavigationFrame extends Roact.Component<NavigationFramePropTypes> {
	render() {
		return (
			<Container RefValue={this.props.RefValue}>
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
						OnClick={(e) => this.props.OnClick(e)}
					/>
					{calculatePermissionsOfUser(this.props, Players.LocalPlayer.UserId).Build ? (
						<>
							<NavFrameButton
								Text="World Settings"
								Color={Color3.fromRGB(235, 235, 236)}
								Icon="rbxassetid://5627731849"
								OnClick={(e) => this.props.OnClick(e)}
							/>
						</>
					) : undefined}
					<NavFrameButton
						Text="Permissions"
						Color={Color3.fromRGB(235, 235, 236)}
						Icon="rbxassetid://5627731849"
						OnClick={(e) => this.props.OnClick(e)}
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

	shouldUpdate(nextProps: NavigationFramePropTypes) {
		return !deepEquals(nextProps.Permissions, this.props.Permissions);
	}
}

const mapStateToProps = ({ World: { Info } }: IState): MappedProps => {
	return {
		Bans: Info.Banned,
		Owner: Info.Owner,
		Permissions: Info.Permissions,
	};
};

export default connect(mapStateToProps)(NavigationFrame);
