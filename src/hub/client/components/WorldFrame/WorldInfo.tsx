import { Players } from "@rbxts/services";
import Roact from "@rbxts/roact";
import LikeButton from "./LikeButton";
import PlayersCount from "./Players";
import FeaturedTag from "./FeaturedTag";

function Gap() {
	return <frame BackgroundTransparency={1} Size={UDim2.fromScale(0, 0.095)} />;
}

function WorldInfoBar(props: { World: World, Transparency: Roact.Binding<number> }) {
	return (
		<frame BackgroundTransparency={1} BorderSizePixel={1} Size={UDim2.fromScale(0.15, 0.7)}>
			<LikeButton Transparency={props.Transparency} />
			<Gap />
			<PlayersCount Max={props.World.Info.MaxPlayers} Current={props.World.Info.ActivePlayers} Transparency={props.Transparency} />
			<Gap />
			<FeaturedTag Transparency={props.Transparency} />
			<uilistlayout VerticalAlignment={Enum.VerticalAlignment.Bottom} />
		</frame>
	);
}

interface WorldInfoPropTypes {
	World: World,
	Transparency: Roact.Binding<number>;
}

class WorldInfo extends Roact.Component<WorldInfoPropTypes> {
	worldOwnerRef: Roact.Ref<TextLabel>;

	constructor(props: WorldInfoPropTypes) {
		super(props);

		this.worldOwnerRef = Roact.createRef();
	}

	render() {
		return (
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.86, 0.825)}
			>
				<WorldInfoBar World={this.props.World} Transparency={this.props.Transparency} />
				<textlabel
					BackgroundTransparency={1}
					Size={UDim2.fromScale(1, 0.16)}
					Font={Enum.Font.GothamBold}
					Text={this.props.World.Settings.Name}
					TextColor3={new Color3(1, 1, 1)}
					TextScaled={true}
					TextSize={14}
					TextWrapped={true}
					TextTransparency={this.props.Transparency}
					TextXAlignment={Enum.TextXAlignment.Left}
				/>
				<textlabel
					BackgroundTransparency={1}
					Size={UDim2.fromScale(1, 0.12)}
					Font={Enum.Font.GothamSemibold}
					TextColor3={new Color3(1, 1, 1)}
					TextScaled={true}
					TextSize={14}
					TextWrapped={true}
					TextTransparency={this.props.Transparency}
					TextXAlignment={Enum.TextXAlignment.Left}
					Ref={this.worldOwnerRef}
				/>
				<uilistlayout VerticalAlignment={Enum.VerticalAlignment.Bottom} Padding={new UDim(0, 1)} />
			</frame>
		);
	}

	didMount() {
		const worldOwner = this.worldOwnerRef.getValue();
		assert(worldOwner);

		const result = opcall(() => Players.GetNameFromUserIdAsync(this.props.World.Info.Owner));

		result.success ? (worldOwner.Text = result.value) : (worldOwner.Text = "N/A");
	}
}

export default WorldInfo;
