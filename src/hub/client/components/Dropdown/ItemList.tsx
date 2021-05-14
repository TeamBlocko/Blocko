import { UserInputService } from "@rbxts/services";
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
				Size={UDim2.fromScale(0.9, 0.55)}
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
		const canvasSize = 18 * this.props.Items.size();
		return (
			<frame
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundColor3={new Color3(1, 1, 1)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.45, 2)}
				Size={this.props.Binding.map((value) =>
					new UDim2(1.65, 0, 10 * value, 0),
				)}
				ZIndex={10}
			>
				<uicorner CornerRadius={new UDim(0, 5)} />
				<scrollingframe
					Ref={this.itemsListRef}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={new Color3(1, 1, 1)}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 1)}
					AutomaticCanvasSize={Enum.AutomaticSize.None}
					ScrollingDirection={Enum.ScrollingDirection.Y}
					CanvasSize={UDim2.fromOffset(125, canvasSize > 150 ? canvasSize : 0)}
					ScrollBarImageColor3={Color3.fromRGB(31, 31, 31)}
					ScrollBarImageTransparency={this.props.Binding.map((value) => 1 - value)}
					ScrollBarThickness={5}
					VerticalScrollBarInset={Enum.ScrollBarInset.ScrollBar}
				>
					<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} />
					<Gap Length={2} />
					{this.props.Items.map((Item) => (
						<ItemElement Value={Item} Handler={this.props.OnSelected} />
					))}
				</scrollingframe>
			</frame>
		);
	}

	didMount() {
		const scrollingFrame = this.itemsListRef.getValue();
		if (!scrollingFrame) return;

		if (this.connection) this.connection.Disconnect();
		this.connection = UserInputService.InputBegan.Connect((inputObject, gameProcessed) => {
			if (gameProcessed) return;
			if (inputObject.UserInputType === Enum.UserInputType.Keyboard && inputObject.KeyCode.Name.size() === 0) {
				const objectIndex = this.props.Items.findIndex(
					(item) => item.Name.sub(1, 1) === inputObject.KeyCode.Name,
				);
				if (objectIndex === -1) return;
				scrollingFrame.CanvasPosition = new Vector2(0, 18 * objectIndex);
			}
		});
	}
}

export default ItemList;
