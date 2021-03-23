import { Players } from "@rbxts/services"
import Roact from "@rbxts/roact";
import { getUserPermissions } from "shared/permissionsUtility";
import { IState } from "shared/Types";
import { connect } from "@rbxts/roact-rodux";

interface PlayerFramePropTypes {
	UserId: number;
	LayoutOrder: number
}

function PermissionType(props: { Name: PermissionTypes }) {
	return (
		<textlabel
			BackgroundColor3={Color3.fromRGB(77, 77, 77)}
			Size={UDim2.fromOffset(52, 18)}
			Font={Enum.Font.Gotham}
			Text={props.Name}
			TextColor3={Color3.fromRGB(245, 245, 245)}
			TextSize={12}
			TextWrapped={true}
		>
			<uicorner />
		</textlabel>
	)
}

class PlayerFrame extends Roact.Component<PlayerFramePropTypes & World> {

	avatarImage: Roact.Ref<ImageLabel>;
	name: Roact.Ref<TextLabel>;

	constructor(props: PlayerFramePropTypes & World) {
		super(props);

		this.avatarImage = Roact.createRef()
		this.name = Roact.createRef()
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
				<uicorner/>
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
					<PermissionType Name={getUserPermissions(this.props.Info, this.props.UserId).Type}/>	
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						Padding={new UDim(0, 5)}
					/>
				</frame>
			</frame>
		)
	}

	didMount() {
		const [thumbnail] = Players.GetUserThumbnailAsync(this.props.UserId, Enum.ThumbnailType.HeadShot, Enum.ThumbnailSize.Size48x48)
		const name = Players.GetNameFromUserIdAsync(this.props.UserId)

		const imageLabel = this.avatarImage.getValue()!
		const nameLabel = this.name.getValue()!

		imageLabel.Image = thumbnail
		nameLabel.Text = name
	}
}

export default connect((state: IState) => state.World)(PlayerFrame)
