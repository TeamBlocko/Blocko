import Roact from "@rbxts/roact";

interface NavButtonPropTypes {
	Image: string
	ImageRectOffset: Vector2,
	ImageRectSize: Vector2,
}

function NavButton(props: NavButtonPropTypes) {
	return (
		<imagebutton
			BackgroundTransparency={1}
			Size={UDim2.fromScale(0.3, 0.042)}
			{...props}
		>
			<uiaspectratioconstraint AspectRatio={0.99516522884369} />
		</imagebutton>
	)
}

export default NavButton;