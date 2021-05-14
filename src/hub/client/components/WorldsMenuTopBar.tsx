import Roact from "@rbxts/roact";
import Search from "./Search";

function WorldsMenuTopBar(props: { Text: string }) {
	return (
		<frame
			AnchorPoint={new Vector2(0, 1)}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0, 1)}
			Size={UDim2.fromScale(1, 1)}
		>
			<Search />
			<imagelabel
				AnchorPoint={new Vector2(1, 0)}
				BackgroundColor3={Color3.fromRGB(72, 178, 255)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(1, 0)}
				Size={UDim2.fromScale(1, 0.326)}
				Image={"rbxasset://textures/ui/GuiImagePlaceholder.png"}
				ImageTransparency={1}
			>
				<textlabel
					BackgroundTransparency={1}
					Size={UDim2.fromScale(1, 1)}
					Font={Enum.Font.GothamBlack}
					Text={props.Text}
					TextColor3={new Color3(1, 1, 1)}
					TextScaled={true}
					TextSize={14}
					TextWrapped={true}
				/>
			</imagelabel>
		</frame>
	);
}

export default WorldsMenuTopBar;