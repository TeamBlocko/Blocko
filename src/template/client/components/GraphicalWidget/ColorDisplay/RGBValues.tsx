import { TextService } from "@rbxts/services";
import Roact from "@rbxts/roact";
import NumberInput from "template/client/components/misc/NumberInput";

interface RGBValuesPropTypes {
	Value: Color3;
	onTextChange: onTextChange;
}

interface CommaPropTypes {
	LayoutOrder: number;
}

interface NumberDisplayPropTypes extends CommaPropTypes {
	Text: string;
	Type: RGB;
	onTextChange: onTextChange;
}

function Comma(props: CommaPropTypes) {
	return (
		<textlabel
			BackgroundTransparency={1}
			LayoutOrder={props.LayoutOrder}
			Size={new UDim2(0, 2, 0.675, 0)}
			Font={Enum.Font.Gotham}
			Text=","
			TextColor3={new Color3(1, 1, 1)}
			TextSize={14}
			TextTransparency={0.5}
		/>
	);
}

const getSize = (text: string): Vector2 => TextService.GetTextSize(text, 12, Enum.Font.GothamBold, new Vector2());

function NumberDisplay(props: NumberDisplayPropTypes) {
	const xSize = getSize(props.Text).X;
	return (
		<NumberInput
			TextBoxProps={{
				AnchorPoint: new Vector2(0.5, 0.5),
				BackgroundTransparency: 1,
				LayoutOrder: props.LayoutOrder,
				Size: new UDim2(0, xSize, 0.675, 0),
				Font: Enum.Font.GothamBold,
				Text: props.Text,
				ClearTextOnFocus: false,
				TextColor3: Color3.fromRGB(227, 227, 227),
				TextSize: 12,
				TextXAlignment: Enum.TextXAlignment.Right,
			}}
			OnValidInput={(e, value) => {
				props.onTextChange(props.Type, value);
				e.Size = new UDim2(0, getSize(tostring(value)).X, 0.675, 0);
			}}
			ValidationHandler={(input) => {
				print("INPUT", input)
				const [match] = input.match("%d+");
				print("MATCH", match);
				return match ? tostring(math.clamp(tonumber(match)!, 0, 255)) : undefined;
			}}
		/>
	);
}

function RGBValues(props: RGBValuesPropTypes) {
	return (
		<frame
			AnchorPoint={new Vector2(1, 0.5)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.85, 0.5)}
			Size={UDim2.fromOffset(100, 18)}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Right}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			{(["R", "G", "B"] as RGB[]).map((value: RGB, index) => (
				<Roact.Fragment>
					<NumberDisplay
						Type={value}
						Text={tostring(props.Value[value] * 255)}
						LayoutOrder={index * 2 + 1}
						onTextChange={(...args) => props.onTextChange(...args)}
					/>
					{index === 2 || <Comma LayoutOrder={index * 2 + 2} />}
				</Roact.Fragment>
			))}
		</frame>
	);
}

export default RGBValues;
