import { HttpService } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { t } from "@rbxts/t";
import { DragDropProvider, DragFrame, DropFrame } from "@rbxts/roact-dnd";

const targetDataChecker = t.interface({
	Type: t.literal("Container"),
	Id: t.string,
})

type TargetData = t.static<typeof targetDataChecker>;

interface ContainerState {
	attached?: string;
}

export class Container extends Roact.Component<{}, ContainerState> {
	Id: string;
	binding: Roact.Binding<number>;
	setBinding: Roact.BindingFunction<number>;

	constructor(props: {}) {
		super(props);
		this.Id = HttpService.GenerateGUID();

		[this.binding, this.setBinding] = Roact.createBinding(100);

		this.setState({});
	}

	render() {
		return (
			<DragDropProvider>
				<DragFrame
					DropId=""
					TargetData={identity<TargetData>({
						Type: "Container",
						Id: this.Id,
					})}
					Size={this.binding.map((value) => UDim2.fromOffset(100, value))}
				>
					<DropFrame
						DropId=""
						TargetDropped={(targetData, e) => {
							print(targetData);
							if (targetDataChecker(targetData)) {
								this.setBinding(e.AbsoluteSize.Y);
							}
						}}
						BackgroundColor3={new Color3(1, 1, 1)}
						BorderSizePixel={0}
						AnchorPoint={new Vector2(1, 0.5)}
						Position={UDim2.fromScale(1, 0.5)}
					/>
				</DragFrame>
			</DragDropProvider>
		)
	}
}