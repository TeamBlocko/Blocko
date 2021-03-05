import Roact, { RoactBinding } from "@rbxts/roact";

function ItemElement<T extends Item>(props: { Value: T; Handler: NonNullable<RoactEvents<TextButton>["Activated"]> }) {
	return (
		<textbutton
			Key={props.Value.Name}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(60, 60, 60)}
			BackgroundTransparency={0.5}
			Size={UDim2.fromOffset(125, 18)}
			Font={Enum.Font.GothamBold}
			Text={`  ${props.Value.Name}`}
			TextColor3={Color3.fromRGB(217, 217, 217)}
			TextSize={10}
			TextXAlignment={Enum.TextXAlignment.Left}
			Event={{
				Activated: props.Handler
			}}
		>
			<uicorner CornerRadius={new UDim(0.25, 0)} />
		</textbutton>
	);
}

export interface ItemListPropTypes<T> {
	Items: T[];
	OnSelected: NonNullable<RoactEvents<TextButton>["Activated"]>;
	Binding: RoactBinding<number>;
}

function ItemList<T extends Item>(props: ItemListPropTypes<T>) {
	return (
		<frame
			AnchorPoint={new Vector2(1, 0)}
			BackgroundColor3={Color3.fromRGB(60, 60, 60)}
			BorderSizePixel={0}
			Position={new UDim2(1, 0, 1, 5)}
			Size={props.Binding.map((value) => UDim2.fromOffset(135, 0).Lerp(UDim2.fromOffset(135, 150), value))}
			ZIndex={10}
		>
			<uicorner CornerRadius={new UDim(0, 5)} />
			<scrollingframe
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.96, 1)}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				CanvasSize={UDim2.fromOffset(125, 18 * props.Items.size())}
				ScrollBarImageColor3={Color3.fromRGB(31, 31, 31)}
				ScrollBarThickness={5}
				VerticalScrollBarInset={Enum.ScrollBarInset.ScrollBar}
			>
				<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} />
				{props.Items.map((Item) => (
					<ItemElement Value={Item} Handler={props.OnSelected} />
				))}
			</scrollingframe>
		</frame>
	);
}

export default ItemList;
