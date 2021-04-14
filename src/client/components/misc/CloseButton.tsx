import Roact from "@rbxts/roact";

interface CloseButtonPropTypes {
	OnClose: (inputButton: ImageButton) => void;
}

function CloseButton(props: CloseButtonPropTypes) {
	return (
		<imagebutton
			BackgroundTransparency={1}
			Size={UDim2.fromOffset(10, 10)}
			Image="rbxassetid://5689916920"
			Event={{
				Activated: (e) => props.OnClose(e),
			}}
		/>
	);
}

export default CloseButton;
