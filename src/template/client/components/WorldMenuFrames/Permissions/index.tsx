import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { IState } from "template/shared/Types";
import { Players } from "@rbxts/services";
import PlayerFrame from "./PlayerFrame";
import Container from "../WorldMenuFramesContainer";
import NavBar from "../NavBar";

interface PermissionsPropTypes extends MappedProps, WorldMenuFrames {}

interface MappedProps {
	ActivePlayers: number;
}

class Permissions extends Roact.Component<PermissionsPropTypes> {
	render() {
		return (
			<Container RefValue={this.props.RefValue}>
				<uicorner />
				<NavBar Text="Permissions" OnClick={(e) => this.props.OnClick(e)} />
				<scrollingframe
					AnchorPoint={new Vector2(0.5, 1)}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.5, 1)}
					Selectable={false}
					Size={new UDim2(1, 0, 1, -45)}
					ScrollBarImageTransparency={0.85}
					ScrollBarThickness={3}
					VerticalScrollBarInset={Enum.ScrollBarInset.ScrollBar}
				>
					{Players.GetPlayers().map((player, index) => (
						<PlayerFrame UserId={player.UserId} LayoutOrder={index} />
					))}
					<uilistlayout
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						SortOrder={Enum.SortOrder.LayoutOrder}
						Padding={new UDim(0, 5)}
					/>
				</scrollingframe>
			</Container>
		);
	}
}

const mapStateToProps = (state: IState): MappedProps => {
	return {
		ActivePlayers: state.World.Info.ActivePlayers,
	};
};

export default connect(mapStateToProps)(Permissions);
