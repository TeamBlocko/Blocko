import Roact from "@rbxts/roact";
import { nextInTable } from "template/shared/utility";
import GWFrame from "../misc/GWFrame";
import TitleText from "../misc/TitleText";

interface SizePropTypes extends GWPropTypes<Vector3> {
	SizeYOffset?: number;
	Bindable?: BindableEvent;
}

interface SizeTogglePropTypes {
	Value: number;
	OnClick: () => void;
}

const values = [2, 4] as const;

function SizeToggle(props: SizeTogglePropTypes) {
	return (
		<textbutton
			BackgroundColor3={Color3.fromRGB(60, 60, 60)}
			Size={UDim2.fromOffset(17, 17)}
			Font={Enum.Font.GothamBold}
			Text={tostring(props.Value)}
			TextColor3={Color3.fromRGB(217, 217, 217)}
			TextSize={12}
			Event={{
				Activated: () => props.OnClick(),
			}}
		>
			<uicorner CornerRadius={new UDim(0, 5)} />
		</textbutton>
	);
}

function Cross() {
	return (
		<textlabel
			BackgroundTransparency={1}
			Size={new UDim2(0, 7, 1, 0)}
			Font={Enum.Font.Gotham}
			Text={"x"}
			TextColor3={Color3.fromRGB(217, 217, 217)}
			TextScaled={true}
			TextSize={14}
			TextTransparency={0.5}
			TextWrapped={true}
		/>
	);
}

class Size extends Roact.Component<SizePropTypes> {
	constructor(props: SizePropTypes) {
		super(props);
	}

	render() {
		return (
			<GWFrame SizeOffsetY={this.props.SizeYOffset ?? 30} LayoutOrder={this.props.LayoutOrder}>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<TitleText Text={"Size"} Position={UDim2.fromScale(0, 0.5)} AnchorPoint={new Vector2(0, 0.5)} />
				<frame
					AnchorPoint={new Vector2(1, 0.5)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.975, 0.5)}
					Size={UDim2.fromOffset(135, 18)}
				>
					<SizeToggle
						Value={this.props.Default.X}
						OnClick={() =>
							this.props.OnChange(
								new Vector3(
									nextInTable(values, this.props.Default.X),
									this.props.Default.Y,
									this.props.Default.Z,
								),
							)
						}
					/>
					<Cross />
					<SizeToggle
						Value={this.props.Default.Y}
						OnClick={() =>
							this.props.OnChange(
								new Vector3(
									this.props.Default.X,
									nextInTable(values, this.props.Default.Y),
									this.props.Default.Z,
								),
							)
						}
					/>
					<Cross />
					<SizeToggle
						Value={this.props.Default.Z}
						OnClick={() =>
							this.props.OnChange(
								new Vector3(
									this.props.Default.X,
									this.props.Default.Y,
									nextInTable(values, this.props.Default.Z),
								),
							)
						}
					/>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Right}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						Padding={new UDim(0.025, 0)}
					/>
				</frame>
			</GWFrame>
		);
	}
}

export default Size;
