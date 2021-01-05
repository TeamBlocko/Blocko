import Roact, { Component } from "@rbxts/roact";
import NavigationFrame from "./NavigationFrame";

class WorldMenu extends Component {
	render() {
		return (
			<frame
				AnchorPoint={new Vector2(1, 0)}
				BackgroundColor3={Color3.fromRGB(30, 30, 30)}
				Position={UDim2.fromScale(1, 0)}
				Size={new UDim2(0, 300, 1, 0)}
			>
				<scrollingframe
					AnchorPoint={new Vector2(0.5, 1)}
					BackgroundColor3={Color3.fromRGB(30, 30, 30)}
					BorderSizePixel={0}
					CanvasSize={new UDim2()}
					Position={UDim2.fromScale(0.5, 1)}
					Selectable={false}
					Size={UDim2.fromScale(1, 1)}
					ScrollBarImageColor3={Color3.fromRGB(91, 91, 91)}
					ScrollBarImageTransparency={1}
					ScrollBarThickness={0}
					ScrollingEnabled={false}
					VerticalScrollBarInset={Enum.ScrollBarInset.ScrollBar}
				>
					<uipagelayout
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
						Circular={true}
						EasingStyle={Enum.EasingStyle.Quint}
						GamepadInputEnabled={false}
						ScrollWheelInputEnabled={false}
						TouchInputEnabled={false}
						TweenTime={0.5}
					/>
					<NavigationFrame />
				</scrollingframe>
				<imagelabel
					AnchorPoint={new Vector2(0, 0.5)}
					BackgroundColor3={new Color3(1, 1, 1)}
					BackgroundTransparency={1}
					Position={new UDim2(0, -25, 0.5, 0)}
					Size={new UDim2(0, 95, 2, 0)}
					ZIndex={0}
					Image={"rbxgameasset://Images/Rectangle 23"}
					ImageColor3={Color3.fromRGB(30, 30, 30)}
					ImageTransparency={0.1}
				/>
			</frame>
		);
	}
}

export default WorldMenu;
