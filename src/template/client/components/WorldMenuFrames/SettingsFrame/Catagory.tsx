import { TextService } from "@rbxts/services";
import Roact from "@rbxts/roact";

interface CatagoryPropTypes {
	Text: string;
	Image: string;
}

function Catagory(props: CatagoryPropTypes) {
	const textSize = TextService.GetTextSize(` ${props.Text}`, 14, Enum.Font.GothamSemibold, new Vector2()).X + 20;
	const [binding, setBinding] = Roact.createBinding(0);

	return (
		<frame
			BackgroundTransparency={1}
			Size={new UDim2(0.95, 0, 0, 17)}
			Change={{ AbsoluteSize: (e) => setBinding(e.AbsoluteSize.X) }}
		>
			<imagelabel
				Active={true}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(20, 20)}
				Image={props.Image}
				ImageColor3={Color3.fromRGB(208, 208, 208)}
				ImageRectOffset={new Vector2(524, 444)}
				ImageRectSize={new Vector2(36, 36)}
				ScaleType={Enum.ScaleType.Fit}
			/>
			<textlabel
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
				Size={UDim2.fromOffset(textSize, 17)}
				Font={Enum.Font.GothamSemibold}
				Text={` ${props.Text}`}
				TextColor3={Color3.fromRGB(208, 208, 208)}
				TextSize={14}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<frame
				AnchorPoint={new Vector2(1, 0.5)}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={0.9}
				BorderSizePixel={0}
				Size={binding.map((value) => UDim2.fromOffset(value - textSize - 20, 2))}
			/>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
		</frame>
	);
}

export default Catagory;
