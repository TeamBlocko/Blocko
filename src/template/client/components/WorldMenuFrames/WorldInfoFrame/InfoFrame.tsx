import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { IState } from "template/shared/Types";

interface InfoPropTypes {
	Text: string;
	Name: string;
	Image: string;
}

function Info(props: InfoPropTypes) {
	return (
		<textlabel
			AnchorPoint={new Vector2(0, 0.5)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(1.3, 0.5)}
			Size={UDim2.fromOffset(45, 45)}
			Font={Enum.Font.Gotham}
			Text={props.Text}
			TextColor3={Color3.fromRGB(225, 225, 225)}
			TextSize={16}
			TextWrapped={true}
			TextYAlignment={Enum.TextYAlignment.Top}
		>
			<imagelabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={new UDim2(0.5, 0, 0, -15)}
				Size={UDim2.fromOffset(19, 19)}
				Image={props.Image}
				ImageColor3={Color3.fromRGB(225, 225, 255)}
				ImageRectOffset={new Vector2(764, 244)}
				ImageRectSize={new Vector2(36, 36)}
			/>
		</textlabel>
	);
}

interface InfoFramePropTypes extends MappedProps {}

interface MappedProps {
	NumberOfBlocks: number;
	ActivePlayers: number;
	MaxPlayers: number;
	PlaceVisits: number;
}

class InfoFrame extends Roact.PureComponent<InfoFramePropTypes> {
	render() {
		return (
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={new Color3()}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 1)}
				Size={UDim2.fromOffset(300, 75)}
			>
				<frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={Color3.fromRGB(30, 30, 30)}
					BorderColor3={Color3.fromRGB(50, 50, 50)}
					Position={UDim2.fromScale(0.5, 0)}
					Size={UDim2.fromScale(1, 1)}
				>
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Bottom}
						Padding={new UDim(0, 35)}
					/>
					<Info Name="Blocks" Text={`${this.props.NumberOfBlocks}`} Image="rbxgameasset://Images/Block" />
					<Info
						Name="Players"
						Text={`${this.props.ActivePlayers}/${this.props.MaxPlayers}`}
						Image="rbxassetid://3926305904"
					/>
					<Info Name="Visits" Text={`${this.props.PlaceVisits}`} Image="rbxassetid://3926307971" />
				</frame>
			</frame>
		);
	}
}

const mapStateToProps = ({ World: { Info } }: IState): MappedProps => {
	return {
		ActivePlayers: Info.ActivePlayers,
		MaxPlayers: Info.MaxPlayers,
		NumberOfBlocks: Info.NumberOfBlocks,
		PlaceVisits: Info.PlaceVisits,
	};
};

export default connect(mapStateToProps)(InfoFrame);
