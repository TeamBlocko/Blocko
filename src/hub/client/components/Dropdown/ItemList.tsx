import Roact, { RoactBinding, createRef } from "@rbxts/roact";
import Gap from "common/client/components/misc/Gap";

function ItemElement<T extends Item>(props: { Value: T; Handler: NonNullable<RoactEvents<TextButton>["Activated"]> }) {
	return (
		<textbutton
			Key={props.Value.Name}
			BackgroundColor3={new Color3(1, 1, 1)}
			BackgroundTransparency={0.75}
			Size={new UDim2(0.925, 0, 0.29, 0)}
			Font={Enum.Font.GothamSemibold}
			Text={``}
			TextColor3={new Color3(1, 1, 1)}
			TextSize={18}
			Event={{
				Activated: props.Handler,
			}}
		>
			<textlabel
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.8, 0.55)}
				Font={Enum.Font.GothamSemibold}
				Text={props.Value.Name}
				TextColor3={Color3.fromRGB(120, 120, 120)}
				TextScaled={true}
				TextSize={14}
				TextWrapped={true}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0, 15)}
			/>
			<uicorner CornerRadius={new UDim(0.25, 0)} />
		</textbutton>
	);
}

export interface ItemListPropTypes<T> {
	Items: T[];
	OnSelected: NonNullable<RoactEvents<TextButton>["Activated"]>;
	Binding: RoactBinding<number>;
	SizeX?: number;
	Expanded: boolean;
}

class ItemList<T extends Item> extends Roact.Component<ItemListPropTypes<T>> {
	itemsListRef: Roact.Ref<ScrollingFrame>;
	connection: RBXScriptConnection | undefined;

	constructor(props: ItemListPropTypes<T>) {
		super(props);

		this.itemsListRef = createRef();

		props.Items.sort((a, b) => a.Name < b.Name);
	}

	render() {
		return (
			<frame
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={new Color3(1, 1, 1)}
				BorderSizePixel={0}
				BackgroundTransparency={1}
				Position={this.props.Binding.map((value) =>
					UDim2.fromScale(0.45, 2.6).Lerp(UDim2.fromScale(0.45, 2.1), value),
				)}
				Size={new UDim2(1.65, 0, 6, 0)}
				Visible={this.props.Expanded}
				ZIndex={3}
			>
				<frame
					BackgroundColor3={new Color3(1, 1, 1)}
					BorderSizePixel={0}
					Size={UDim2.fromScale(1, 1)}
					ZIndex={10}
				>
					<uicorner CornerRadius={new UDim(0.1, 0)} />
					<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} />
					<Gap Length={2} />
					{this.props.Items.map((Item) => (
						<ItemElement Value={Item} Handler={this.props.OnSelected} />
					))}
				</frame>
			</frame>
		);
	}
}

export default ItemList;
