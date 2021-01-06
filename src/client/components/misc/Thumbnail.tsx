import Roact from "@rbxts/roact";

interface ThumbmailPropTypes {
	Position: UDim2;
}

function Thumbnail(props: ThumbmailPropTypes) {
	return (
		<imagelabel
			AnchorPoint={new Vector2(0.5, 0)}
			BackgroundColor3={Color3.fromRGB(57, 57, 57)}
			BackgroundTransparency={0.8}
			Position={props.Position}
			Size={UDim2.fromOffset(300, 180)}
			Image={"rbxassetid://5303231665"}
			ScaleType={Enum.ScaleType.Crop}
		/>
	);
}

export default Thumbnail;
