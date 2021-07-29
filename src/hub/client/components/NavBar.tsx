import Roact from "@rbxts/roact";
import NavButton from "./NavButton";

function NavBar() {
	return (
		<frame
			AnchorPoint={new Vector2(0, 0.5)}
			BackgroundColor3={Color3.fromRGB(30, 30, 30)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0, 0.5)}
			Size={UDim2.fromScale(0.078, 1)}
		>
			<NavButton
				Image="rbxassetid://3926305904"
				ImageRectOffset={new Vector2(964, 204)}
				ImageRectSize={new Vector2(36, 36)}
				Selected={true}
				OnClick={() => print("Home")}
			/>
			<NavButton
				Image="rbxassetid://3926305904"
				ImageRectOffset={new Vector2(200, 4)}
				ImageRectSize={new Vector2(24, 24)}
				OnClick={() => print("Shop")}
			/>
			<NavButton
				Image="rbxassetid://3926305904"
				ImageRectOffset={new Vector2(924, 364)}
				ImageRectSize={new Vector2(36, 36)}
				OnClick={() => print("Edit")}
			/>
			<NavButton
				Image="rbxassetid://3926305904"
				ImageRectOffset={new Vector2(144, 4)}
				ImageRectSize={new Vector2(24, 24)}
				OnClick={() => print("Friends")}
			/>
			<NavButton
				Image="rbxassetid://3926305904"
				ImageRectOffset={new Vector2(844, 564)}
				ImageRectSize={new Vector2(36, 36)}
				OnClick={() => print("Notifications")}
			/>
			<uilistlayout
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0.025, 0)}
			/>
		</frame>
	);
}

export default NavBar;
