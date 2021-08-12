import { Players } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { langList } from "common/shared/utility";

function TagsList(props: { Tags: string[] }) {
	return (
		<frame AnchorPoint={new Vector2(0.5, 0)} BackgroundTransparency={1} Size={UDim2.fromScale(1, 0.115)}>
			<textlabel
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 0.9)}
				Font={Enum.Font.GothamSemibold}
				Text={langList(props.Tags)}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
				TextSize={14}
				TextTransparency={0.5}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
		</frame>
	);
}

interface OwnerTextPropTypes {
	Owner: number;
}

class OwnerText extends Roact.Component<OwnerTextPropTypes> {
	ownerNameRef: Roact.Ref<TextLabel>;
	ownerImageRef: Roact.Ref<ImageLabel>;

	constructor(props: OwnerTextPropTypes) {
		super(props);

		this.ownerNameRef = Roact.createRef();
		this.ownerImageRef = Roact.createRef();
	}

	render() {
		return (
			<frame
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.075)}
				Size={UDim2.fromScale(0.945, 0.1)}
			>
				<imagelabel BackgroundTransparency={1} Size={UDim2.fromScale(1, 1)} Ref={this.ownerImageRef}>
					<uiaspectratioconstraint />
					<uicorner CornerRadius={new UDim(1, 0)} />
				</imagelabel>
				<textlabel
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.075)}
					Size={UDim2.fromScale(0.95, 1)}
					Font={Enum.Font.Gotham}
					RichText={true}
					TextColor3={new Color3(1, 1, 1)}
					TextScaled={true}
					TextSize={14}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					Ref={this.ownerNameRef}
				/>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0.015, 0)}
				/>
			</frame>
		);
	}

	didMount() {
		const ownerName = this.ownerNameRef.getValue();
		const ownerImage = this.ownerImageRef.getValue();

		if (!ownerName || !ownerImage) return;

		const [thumbnailSuccess, thumbnail] = pcall(() =>
			Players.GetUserThumbnailAsync(this.props.Owner, Enum.ThumbnailType.HeadShot, Enum.ThumbnailSize.Size48x48),
		);
		const [nameSuccess, name] = pcall(() => Players.GetNameFromUserIdAsync(this.props.Owner));

		ownerName.Text = nameSuccess ? name : "N/A";
		ownerImage.Image = thumbnailSuccess ? thumbnail : "";
	}
}

interface FriendsPlayingPropTypes {
	WorldId: number;
}

class FriendsPlaying extends Roact.Component<FriendsPlayingPropTypes> {
	friendsTextRef: Roact.Ref<TextLabel>;
	friendsPlayingFrame: Roact.Ref<Frame>;

	constructor(props: FriendsPlayingPropTypes) {
		super(props);

		this.friendsTextRef = Roact.createRef();
		this.friendsPlayingFrame = Roact.createRef();
	}

	render() {
		return (
			<frame
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.075)}
				Size={UDim2.fromScale(0.95, 0.15)}
				Ref={this.friendsPlayingFrame}
				Visible={false}
			>
				<imagelabel
					BackgroundTransparency={1}
					Size={UDim2.fromScale(0.75, 0.75)}
					Image={"rbxassetid://3926305904"}
					ImageColor3={Color3.fromRGB(255, 191, 0)}
					ImageRectOffset={new Vector2(144, 4)}
					ImageRectSize={new Vector2(24, 24)}
					ScaleType={Enum.ScaleType.Fit}
				>
					<uiaspectratioconstraint />
					<uicorner CornerRadius={new UDim(1, 0)} />
				</imagelabel>
				<textlabel
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundTransparency={1}
					Size={UDim2.fromScale(1, 0.6)}
					Font={Enum.Font.Gotham}
					RichText={true}
					TextColor3={Color3.fromRGB(255, 191, 0)}
					TextScaled={true}
					TextSize={14}
					TextWrapped={true}
					TextXAlignment={Enum.TextXAlignment.Left}
					Ref={this.friendsTextRef}
				/>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0.015, 0)}
				/>
			</frame>
		);
	}

	setupFriends() {
		const friendsText = this.friendsTextRef.getValue();
		const friendsPlayingFrame = this.friendsPlayingFrame.getValue();

		if (!friendsText || !friendsPlayingFrame) return;

		const friendsPlaying = Players.LocalPlayer.GetFriendsOnline()
			.filter((friend) => {
				if (friend.LocationType !== LocationType.MobileInGame && friend.LocationType !== LocationType.InGame)
					return;
				return friend.PlaceId === this.props.WorldId;
			})
			.map((friend) => friend.UserName);

		friendsPlayingFrame.Visible = false;
		if (friendsPlaying.size() === 0) return (friendsText.Text = "No friends in this world.");
		friendsPlayingFrame.Visible = true;
		if (friendsPlaying.size() === 1) return (friendsText.Text = `${friendsPlaying[0]} is in this world`);
		friendsText.Text =
			friendsPlaying.size() > 4
				? `${friendsPlaying.shift()!}, ${friendsPlaying.shift()!} and ${friendsPlaying.size()} are in this world!`
				: `${langList(friendsPlaying)} are in this world!`;
	}

	didMount() {
		this.setupFriends();
	}

	didUpdate() {
		this.setupFriends();
	}
}

export function TopFrame(props: { World: World }) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.075)}
			Size={UDim2.fromScale(0.9, 0.45)}
		>
			<OwnerText Owner={props.World.Info.Owner} />
			<FriendsPlaying WorldId={props.World.Info.WorldId} />
			<textlabel
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.17)}
				Size={UDim2.fromScale(0.95, 0.15)}
				Font={Enum.Font.GothamBold}
				Text={props.World.Settings.Name}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={false}
				TextSize={24}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<TagsList Tags={["Soon"]} />
			<textlabel
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.3)}
				Size={UDim2.fromScale(1, 0.4)}
				Font={Enum.Font.Gotham}
				Text={props.World.Settings.Description}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={false}
				TextSize={16}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextYAlignment={Enum.TextYAlignment.Top}
			/>
			<uilistlayout Padding={new UDim(0.025, 0)} />
		</frame>
	);
}
