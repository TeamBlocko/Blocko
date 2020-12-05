import Roact from "@rbxts/roact";

function ItemElement<T extends Item>(props: { Value: T, Handlers: RoactEvents<TextButton> }) {
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
			Event={props.Handlers}
		>
			<uicorner CornerRadius={new UDim(0.25, 0)} />
		</textbutton>
	);
}

interface ItemListPropTypes<T> {
	Items: T[];
	Handlers: RoactEvents<TextButton>;
	Expanded: boolean;
}

function ItemList<T extends Item>(props: ItemListPropTypes<T>) {
	return (
		<frame
			Key="Dropdown"
			AnchorPoint={new Vector2(1, 0)}
			BackgroundColor3={Color3.fromRGB(60, 60, 60)}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0.98, 1)}
			Size={!props.Expanded ? UDim2.fromOffset(135, 0) : UDim2.fromOffset(135, 150)}
			ZIndex={10}
		>
			<uicorner CornerRadius={new UDim(0, 5)} />
			<scrollingframe
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.95, 1)}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				ScrollBarImageColor3={Color3.fromRGB(31, 31, 31)}
				ScrollBarThickness={5}
				VerticalScrollBarInset={Enum.ScrollBarInset.ScrollBar}
			>
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				{props.Items.map((Item) => (
					<ItemElement Value={Item} Handlers={props.Handlers} />
				))}
			</scrollingframe>
		</frame>
	);
}

export default ItemList;
