import { HttpService } from "@rbxts/services";
import Roact, { Component, createRef } from "@rbxts/roact";
import { DragFrame } from "@rbxts/roact-dnd";
import BottomFrame from "./BottomFrame";
import HueSaturationFrame from "./HueSaturationFrame";
import TopFrame from "template/client/components/misc/TopFrame";
import ColorPickerManager from "./ColorPickerManager";

class ColorPicker extends Component<ColorPickerPropTypes, ColorPickerStateTypes> {
	private manager: ColorPickerManager;
	private hsFrameRef: Roact.Ref<ImageButton>;
	private valueFrame: Roact.Ref<TextButton>;

	id = HttpService.GenerateGUID();

	public getDerivedStateFromProps = (
		nextProps: ColorPickerPropTypes,
		currState: ColorPickerStateTypes,
	): ColorPickerStateTypes => {
		if (nextProps.Value !== currState.Value) {
			return {
				Value: nextProps.Value,
			};
		} else {
			return currState;
		}
	};

	constructor(props: ColorPickerPropTypes) {
		super(props);
		this.hsFrameRef = createRef();
		this.valueFrame = createRef();
		this.setState({
			Value: props.Value,
		});
		this.manager = new ColorPickerManager(
			this.state,
			(data: ColorPickerStateTypes) => {
				this.props.onChange(data.Value);
				this.setState(data);
			},
			this.hsFrameRef,
			this.valueFrame,
		);
	}

	willUpdate(nextProps: ColorPickerPropTypes) {
		if (tostring(nextProps.Value) !== tostring(this.props.Value)) {
			this.manager.state = { Value: nextProps.Value };
			this.manager.updateHueSatFromColor();
		}
	}

	shouldUpdate(nextProps: ColorPickerPropTypes, nextState: ColorPickerStateTypes) {
		return (
			nextState.ShouldUpdate ||
			(tostring(nextProps.Value) !== tostring(this.state.Value) &&
				tostring(nextProps.Value) !== tostring(this.props.Value))
		);
	}

	render() {
		return (
			<DragFrame
				DropId="BuildUI"
				DropResetsPosition={false}
				TargetData=""
				BackgroundColor3={Color3.fromRGB(35, 35, 35)}
				BackgroundTransparency={0}
				Size={UDim2.fromOffset(225, 300)}
				Ref={(element) => {
					this.props.UpdateColorPickerBinding !== undefined && this.props.UpdateColorPickerBinding(element);
				}}
			>
				<uicorner CornerRadius={new UDim(0, 10)} />
				<TopFrame
					Text={this.props.Name}
					OnClose={(inputButton: ImageButton) => this.props.OnClose(inputButton)}
				/>
				<HueSaturationFrame RefValue={this.hsFrameRef} Manager={this.manager} />
				<BottomFrame
					RefValue={this.valueFrame}
					Manager={this.manager}
					UpdateColor={this.props.onChange}
					Id={this.id}
				/>
				<imagelabel
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={new UDim2(1, 50, 1, 50)}
					ZIndex={0}
					Image={"rbxassetid://6513986549"}
					ImageColor3={new Color3()}
					ImageTransparency={0.5}
				/>
			</DragFrame>
		);
	}
}

export default ColorPicker;
