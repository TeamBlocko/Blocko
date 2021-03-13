import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { IState } from "shared/Types";

function TitleComp(props: WorldSettings) {
	return (
		<textlabel
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(27, 42, 53)}
			Size={new UDim2(0.95, 0, 0, 40)}
			Font={Enum.Font.GothamBold}
			Text={props.Name}
			TextColor3={new Color3(1, 1, 1)}
			TextSize={17}
			TextWrapped={true}
			TextXAlignment={Enum.TextXAlignment.Left}
			TextYAlignment={Enum.TextYAlignment.Top}
		/>
	);
}

function DescriptionComp(props: WorldSettings) {
	return (
		<textlabel
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			BorderColor3={Color3.fromRGB(27, 42, 53)}
			Size={UDim2.fromScale(0.95, 1)}
			Font={Enum.Font.Gotham}
			Text={props.Description}
			TextColor3={new Color3(1, 1, 1)}
			TextSize={17}
			TextWrapped={true}
			TextXAlignment={Enum.TextXAlignment.Left}
			TextYAlignment={Enum.TextYAlignment.Top}
		/>
	);
}

export const Title = connect((state: IState) => state.WorldInfo.WorldSettings)(TitleComp);

export const Description = connect((state: IState) => state.WorldInfo.WorldSettings)(DescriptionComp);
