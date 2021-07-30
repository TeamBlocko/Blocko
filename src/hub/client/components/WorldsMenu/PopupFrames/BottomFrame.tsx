import Roact from "@rbxts/roact";

interface BottomFramePropTypes {
	Button1Text: string;
	Button2Text: string;
	Button1Click: () => void;
	Button2Click: () => void;
}

interface ButtonPropTypes {
	Text: string;
	OnClick: () => void;
	BackgroundColor: Color3;
}

function Button(props: ButtonPropTypes) {
	return (
		<textbutton
			BackgroundColor3={props.BackgroundColor}
			Size={UDim2.fromScale(0.25, 1)}
			Text={""}
			Event={{
				Activated: () => props.OnClick(),
			}}
		>
			<uicorner CornerRadius={new UDim(0.15, 0)} />
			<textlabel
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.9, 0.475)}
				Text={props.Text}
				Font={Enum.Font.GothamBold}
				TextColor3={new Color3(1, 1, 1)}
				TextScaled={true}
				TextSize={14}
				TextWrapped={true}
			/>
		</textbutton>
	);
}

function BottomFrame(props: BottomFramePropTypes) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 1)}
			BackgroundTransparency={1}
			Position={UDim2.fromScale(0.5, 1)}
			Size={UDim2.fromScale(1, 0.175)}
		>
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.9, 0.5)}
			>
				<Button
					Text={props.Button1Text}
					OnClick={props.Button1Click}
					BackgroundColor={Color3.fromRGB(40, 40, 40)}
				/>
				<Button
					Text={props.Button2Text}
					OnClick={props.Button2Click}
					BackgroundColor={Color3.fromRGB(62, 148, 229)}
				/>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					Padding={new UDim(0.025, 0)}
				/>
			</frame>
		</frame>
	);
}

export default BottomFrame;
