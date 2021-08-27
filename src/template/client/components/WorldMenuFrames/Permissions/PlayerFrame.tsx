import { Players, TextService } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { getUserPermissions, teamBlockoStaff } from "template/shared/permissionsUtility";
import { IState } from "template/shared/Types";
import { connect } from "@rbxts/roact-rodux";
import { deepEquals } from "@rbxts/object-utils";

interface PlayerFramePropTypes {
	UserId: number;
	LayoutOrder: number;
}

function PermissionType(props: { Name: PermissionTypes; Staff?: boolean }) {
	const size = TextService.GetTextSize(props.Name, 12, Enum.Font.Gotham, new Vector2());
	return (
		<textlabel
			BackgroundColor3={Color3.fromRGB(77, 77, 77)}
			Size={UDim2.fromOffset(math.max(size.X + 11, 52), 18)}
			Font={Enum.Font.Gotham}
			Text={props.Name}
			TextColor3={props.Staff ? Color3.fromRGB(60, 164, 255) : Color3.fromRGB(245, 245, 245)}
			TextSize={12}
			TextWrapped={true}
		>
			<uicorner />
		</textlabel>
	);
}

class PlayerFrame extends Roact.Component<PlayerFramePropTypes & World, { staff: PermissionsInfo | undefined }> {
	avatarImage: Roact.Ref<ImageLabel>;
	name: Roact.Ref<TextLabel>;

	constructor(props: PlayerFramePropTypes & World) {
		super(props);

		this.avatarImage = Roact.createRef();
		this.name = Roact.createRef();

		this.setState({});
	}

	render() {
		return (
			<frame
				Key={this.props.UserId}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={0.95}
				LayoutOrder={this.props.LayoutOrder}
				Size={new UDim2(0.95, 0, 0, 55)}
			>
				<uicorner />
				<imagelabel
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundColor3={Color3.fromRGB(97, 97, 97)}
					BackgroundTransparency={0.5}
					Position={UDim2.fromScale(0.025, 0.5)}
					Size={UDim2.fromOffset(45, 45)}
					Ref={this.avatarImage}
				>
					<uicorner CornerRadius={new UDim(0, 10)} />
				</imagelabel>
				<textlabel
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.23, 0.12)}
					Size={UDim2.fromScale(0.72, 0.39)}
					Font={Enum.Font.Gotham}
					Text={"N/A"}
					TextColor3={Color3.fromRGB(245, 245, 245)}
					TextSize={18}
					TextTruncate={Enum.TextTruncate.AtEnd}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					Ref={this.name}
				/>
				<frame
					AnchorPoint={new Vector2(0, 1)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.23, 0.86)}
					Size={UDim2.fromScale(0.725, 0.35)}
				>
					<PermissionType Name={getUserPermissions(this.props.Info, this.props.UserId).Type} />
					{this.state.staff ? <PermissionType Name={this.state.staff.Type} Staff={true} /> : undefined}
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						Padding={new UDim(0, 5)}
					/>
				</frame>
			</frame>
		);
	}

	shouldUpdate(nextProps: PlayerFramePropTypes & World, nextState: { staff: PermissionsInfo | undefined }) {
		return nextState.staff !== this.state.staff || !deepEquals(nextProps, this.props);
	}

	updatePlayerFrame() {
		const [thumbnailSuccess, thumbnail] = pcall(() =>
			Players.GetUserThumbnailAsync(this.props.UserId, Enum.ThumbnailType.HeadShot, Enum.ThumbnailSize.Size48x48),
		);
		const [nameSuccess, name] = pcall(() => Players.GetNameFromUserIdAsync(this.props.UserId));

		const imageLabel = this.avatarImage.getValue();
		const nameLabel = this.name.getValue();

		if (!imageLabel || !nameLabel) return;

		imageLabel.Image = thumbnailSuccess ? thumbnail : "";
		nameLabel.Text = nameSuccess ? name : "N/A";

		this.setState({
			staff: teamBlockoStaff(this.props.UserId),
		});
	}

	didMount() {
		this.updatePlayerFrame();
	}

	didUpdate() {
		this.updatePlayerFrame();
	}
}

export default connect((state: IState) => state.World)(PlayerFrame);
