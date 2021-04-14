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

	private selfUpdate = false;

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
				this.selfUpdate = true;
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

	didUpdate() {
		this.selfUpdate = false;
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
				<BottomFrame RefValue={this.valueFrame} Manager={this.manager} />
			</DragFrame>
		);
	}
}

export default ColorPicker;
