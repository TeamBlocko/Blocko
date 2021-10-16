import Roact from "@rbxts/roact";
import { Client } from "@rbxts/net";
import Flipper from "@rbxts/flipper";
import { NumAbbr } from "@rbxts/number-manipulator";
import { Players, RunService } from "@rbxts/services";
import SyncedPoller from "@rbxts/synced-poller";
import notificationStore from "common/client/notificationStore";

const teleportPlayer = new Client.AsyncFunction<[], [number]>("TeleportPlayer");
teleportPlayer.SetCallTimeout(100);

const numAbbr = new NumAbbr();

interface IconPropTypes {
	ImageTransparency: Roact.Binding<number>;
	ImageRectOffset: Vector2;
	ImageLabelRef?: Roact.Ref<ImageLabel>;
}

function Icon(props: IconPropTypes) {
	return (
		<imagelabel
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(0.75, 0.75)}
			Image={"rbxassetid://3926307971"}
			ImageTransparency={props.ImageTransparency}
			ImageRectOffset={props.ImageRectOffset}
			ImageRectSize={new Vector2(36, 36)}
			ScaleType={Enum.ScaleType.Fit}
			Ref={props.ImageLabelRef}
		>
			<uiaspectratioconstraint />
		</imagelabel>
	);
}

interface PlayButtonPropTypes {
	World: World;
}

type Goal = {
	hover: number;
	activated: number;
	shine: number;
};

class PlayButton extends Roact.Component<PlayButtonPropTypes> {
	binding: Roact.Binding<Goal>;
	setBinding: Roact.BindingFunction<Goal>;

	loadingIconRef: Roact.Ref<ImageLabel>;

	motor: Flipper.GroupMotor<Goal>;

	hovered = false;
	joiningWorld = false;

	constructor(props: PlayButtonPropTypes) {
		super(props);

		this.loadingIconRef = Roact.createRef();

		[this.binding, this.setBinding] = Roact.createBinding({
			hover: 0,
			activated: 0,
			shine: 0,
		});

		this.motor = new Flipper.GroupMotor(this.binding.getValue());

		this.motor.onStep(this.setBinding);
	}

	render() {
		return (
			<textbutton
				Active={true}
				AnchorPoint={new Vector2(0.5, 1)}
				BackgroundColor3={this.binding.map((value) =>
					Color3.fromRGB(40, 40, 40).Lerp(Color3.fromRGB(72, 178, 255), value.hover),
				)}
				ClipsDescendants={true}
				Position={UDim2.fromScale(0.5, 0.93)}
				Size={UDim2.fromScale(1, 0.5)}
				AutoButtonColor={false}
				Font={Enum.Font.SourceSans}
				Text=""
				TextSize={14}
				TextWrapped={true}
				Event={{
					Activated: () => {
						if (this.joiningWorld) return;
						this.joiningWorld = true;
						this.motor.setGoal({ activated: new Flipper.Spring(1) });
						const loadingIcon = this.loadingIconRef.getValue();
						print(loadingIcon);
						if (!loadingIcon) return;
						RunService.RenderStepped.Connect((delta) => {
							loadingIcon.Rotation = (loadingIcon.Rotation - 10 * delta) % 360;
						});
						notificationStore.addNotification({
							Id: "JoiningWorld",
							Title: "Joining World",
							Message: `Teleporting you to world <b>${this.props.World.Settings.Name}</b> [${
								this.props.World.Info.WorldId
							}] by <b>${Players.GetNameFromUserIdAsync(this.props.World.Info.Owner)}</b> [${
								this.props.World.Info.Owner
							}]`,
							Icon: "rbxassetid://7148978151",
						});
						teleportPlayer.CallServerAsync(this.props.World.Info.WorldId);
					},
					MouseEnter: () => {
						this.hovered = true;
						this.motor.setGoal({ hover: new Flipper.Spring(1), shine: new Flipper.Spring(1) });
						this.motor.onComplete(() => {
							this.motor.setGoal({ shine: new Flipper.Instant(0) });
						});
						new SyncedPoller(
							3,
							() => {
								this.motor.setGoal({ shine: new Flipper.Spring(1) });
								this.motor.onComplete(() => {
									this.motor.setGoal({ shine: new Flipper.Instant(0) });
								});
							},
							() => this.hovered,
						);
					},
					MouseLeave: () => {
						this.hovered = false;
						this.motor.setGoal({ hover: new Flipper.Spring(0) });
					},
				}}
			>
				<uicorner CornerRadius={new UDim(0.2)} />
				<Icon
					ImageRectOffset={new Vector2(764, 244)}
					ImageTransparency={this.binding.map((value) => value.activated)}
				/>
				<imagelabel
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Position={this.binding.map((value) =>
						UDim2.fromScale(-0.1, 0.5).Lerp(UDim2.fromScale(1.1, 0.5), value.shine),
					)}
					Size={UDim2.fromScale(0.5, 15)}
					Image={"rbxassetid://5873311937"}
				/>
				<uistroke
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Color={new Color3(1, 1, 1)}
					Thickness={0.75}
					Transparency={0.85}
					LineJoinMode={Enum.LineJoinMode.Round}
				/>
				<Icon
					ImageRectOffset={new Vector2(244, 524)}
					ImageTransparency={this.binding.map((value) => 1 - value.activated)}
					ImageLabelRef={this.loadingIconRef}
				/>
			</textbutton>
		);
	}
}

function InfoText(props: { Icon: string; Text: string; ImageRectOffset?: Vector2 }) {
	return (
		<imagebutton
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.04, 1)}
			Image={props.Icon}
			ImageRectOffset={props.ImageRectOffset}
			ImageRectSize={props.ImageRectOffset ? new Vector2(36, 36) : undefined}
			ScaleType={Enum.ScaleType.Fit}
		>
			<textlabel
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(1.25, 0.5)}
				Size={UDim2.fromScale(3, 0.7)}
				Font={Enum.Font.Gotham}
				Text={props.Text}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
				TextSize={14}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
		</imagebutton>
	);
}

function InfoFrame(props: { World: World }) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.735)}
			Size={UDim2.fromScale(0.9, 0.25)}
		>
			<InfoText Icon={"rbxassetid://3926305904"} ImageRectOffset={new Vector2(764, 284)} Text={"0"} />
			<InfoText Icon={"rbxassetid://3926305904"} ImageRectOffset={new Vector2(724, 964)} Text={"0"} />
			<InfoText
				Icon={"rbxassetid://3926307971"}
				ImageRectOffset={new Vector2(764, 244)}
				Text={numAbbr.abbreviate(props.World.Info.PlaceVisits)}
			/>
			<InfoText Icon={"rbxassetid://5616097311"} Text={numAbbr.abbreviate(props.World.Info.NumberOfBlocks)} />
			<InfoText
				Icon={"rbxassetid://3926305904"}
				ImageRectOffset={new Vector2(4, 844)}
				Text={`${props.World.Info.ActivePlayers}/${props.World.Info.MaxPlayers}`}
			/>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0.12, 0)}
			/>
		</frame>
	);
}

export function BottomFrame(props: { World: World }) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 1)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 0.93)}
			Size={UDim2.fromScale(0.9, 0.2)}
			ZIndex={2}
		>
			<InfoFrame World={props.World} />
			<PlayButton World={props.World} />
			<uilistlayout VerticalAlignment={Enum.VerticalAlignment.Bottom} Padding={new UDim(0.15, 0)} />
		</frame>
	);
}
