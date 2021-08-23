import { UserInputService } from "@rbxts/services";
import Roact, { createRef } from "@rbxts/roact";
import Gap from "common/client/components/misc/Gap";

function ItemElement<T extends Item>(props: {
	Value: T;
	Handler: NonNullable<Roact.JsxInstanceEvents<TextButton>["Activated"]>;
}) {
	return (
		<textbutton
			Key={props.Value.Name}
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundColor3={Color3.fromRGB(60, 60, 60)}
			BackgroundTransparency={0.5}
			Size={new UDim2(0.999, 0, 0, 18)}
			Font={Enum.Font.GothamBold}
			Text={`  ${props.Value.Name}`}
			TextColor3={Color3.fromRGB(217, 217, 217)}
			TextSize={10}
			TextXAlignment={Enum.TextXAlignment.Left}
			Event={{
				Activated: props.Handler,
			}}
		>
			<uicorner CornerRadius={new UDim(0.25, 0)} />
		</textbutton>
	);
}

export interface ItemListPropTypes<T> {
	Items: T[];
	OnSelected: NonNullable<Roact.JsxInstanceEvents<TextButton>["Activated"]>;
	Binding: Roact.Binding<number>;
	SizeX?: number;
	IgnoreClip?: boolean;
}

class ItemList<T extends Item> extends Roact.Component<ItemListPropTypes<T>> {
	itemsListRef: Roact.Ref<ScrollingFrame>;
	connection: RBXScriptConnection | undefined;

	constructor(props: ItemListPropTypes<T>) {
		super(props);

		this.itemsListRef = createRef();
	}

	render() {
		const canvasSize = 18 * this.props.Items.size();
		return (
			<frame
				AnchorPoint={new Vector2(1, 0)}
				BackgroundColor3={Color3.fromRGB(60, 60, 60)}
				BorderSizePixel={0}
				Position={new UDim2(1, 0, 1, 5)}
				Size={this.props.Binding.map((value) =>
					UDim2.fromOffset(this.props.SizeX ?? 135, math.min(canvasSize, 150) * value),
				)}
				ZIndex={10}
				Rotation={this.props.Binding.map((value) => (value === 1 ? (this.props.IgnoreClip ? 0.1 : 0) : 0))}
			>
				<uicorner CornerRadius={new UDim(0, 5)} />
				<scrollingframe
					Ref={this.itemsListRef}
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundColor3={new Color3(1, 1, 1)}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(0.96, 1)}
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
			if (inputObject.UserInputType === Enum.UserInputType.Keyboard && inputObject.KeyCode.Name.size() === 1) {
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
