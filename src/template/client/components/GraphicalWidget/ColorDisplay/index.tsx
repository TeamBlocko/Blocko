import { Workspace } from "@rbxts/services";
import { connect } from "@rbxts/roact-rodux";
import { DragDropProvider } from "@rbxts/roact-dnd";
import Roact, { Component, Portal, createBinding } from "@rbxts/roact";
import GWFrame from "template/client/components/misc/GWFrame";
import TitleText from "template/client/components/misc/TitleText";
import ColorPicker from "../ColorPicker";
import PickButton from "./PickButton";
import RGBValues from "./RGBValues";

import { getPosOnAxis } from "common/shared/utility";
import { IState } from "template/shared/Types";

const currentCamera = Workspace.CurrentCamera;

type Binding = Frame | undefined;

interface ColorDisplayPropTypes extends GWPropTypes<Color3> {
	SizeYOffset?: number;
	Mode: BuildMode;
	Bindable?: BindableEvent;
}

class ColorDisplay extends Component<ColorDisplayPropTypes, ColorDisplayStateTypes> {
	private root: ScreenGui | undefined;
	private colorPickerBinding: Roact.Binding<Binding>;
	private updateColorPickerBinding: Roact.BindingFunction<Binding>;
	private selfRef: Binding;
	private textChangedAllowed = true;

	constructor(props: ColorDisplayPropTypes) {
		super(props);
		[this.colorPickerBinding, this.updateColorPickerBinding] = createBinding<Binding>(undefined);
		this.setState({
			Selected: false,
		});

		this.props.Bindable?.Event.Connect(() => this.setColorPickerPos());
	}

	setColorPickerPos() {
		const element = this.colorPickerBinding.getValue();
		const viewSize = currentCamera?.ViewportSize;

		if (!viewSize || !element || !this.selfRef) return;
		const absolutePos = (this.selfRef.Parent as Frame).AbsolutePosition;
		const scale = absolutePos.div(viewSize);

		let pos: Vector2;
		if (scale.X <= 0.5) {
			const nearest = new Vector2(0, absolutePos.Y);
			pos = getPosOnAxis(absolutePos, nearest, 150).add(new Vector2(element.AbsoluteSize.X / 2, 0));
		} else {
			const nearest = new Vector2(viewSize.X, absolutePos.Y);
			pos = getPosOnAxis(absolutePos, nearest, 150).sub(new Vector2(element.AbsoluteSize.X / 2, 0));
		}
		element.Position = UDim2.fromOffset(pos.X, pos.Y);
	}

	willUpdate() {
		this.textChangedAllowed = false;
	}

	didUpdate() {
		this.textChangedAllowed = true;
	}

	shouldUpdate(nextProps: ColorDisplayPropTypes, nextState: ColorDisplayStateTypes) {
		return (
			tostring(nextProps.Default) !== tostring(this.props.Default) ||
			nextState !== this.state ||
			nextProps.Mode !== this.props.Mode
		);
	}

	onColorChange(color: Color3, isTextChanged?: boolean) {
		if (isTextChanged === true && this.textChangedAllowed === false) {
			return;
		}
		this.props.OnChange(color);
	}

	onTextChange(colorComponent: RGB, value: number): void {
		const rgb = { R: this.props.Default.R, G: this.props.Default.G, B: this.props.Default.B };

		rgb[colorComponent] = value / 255;

		this.onColorChange(new Color3(rgb.R, rgb.G, rgb.B), true);
	}

	HandleClick(inputButton: TextButton | ImageButton) {
		this.root = inputButton.FindFirstAncestorOfClass("ScreenGui");
		this.setState((oldState) => {
			return {
				...oldState,
				Selected: !oldState.Selected,
			};
		});
		this.setColorPickerPos();
	}

	render() {
		return (
			<DragDropProvider>
				<GWFrame SizeOffsetY={this.props.SizeYOffset ?? 30} LayoutOrder={this.props.LayoutOrder}>
					<uicorner
						CornerRadius={new UDim(0, 7)}
						Ref={(n) => {
							if (!n) return;
							this.selfRef = n.Parent as Frame;
						}}
					/>
					<TitleText
						Text={this.props.Name}
						Position={UDim2.fromScale(0, 0.5)}
						AnchorPoint={new Vector2(0, 0.5)}
					/>
					<PickButton
						Value={this.props.Default}
						HandleClick={(inputButton: TextButton) => this.HandleClick(inputButton)}
					/>
					<RGBValues Value={this.props.Default} onTextChange={(...args) => this.onTextChange(...args)} />
					{this.state.Selected && this.root && this.props.Mode === "Place" && (
						<Portal target={this.root}>
							<ColorPicker
								Name={this.props.Name}
								Value={this.props.Default}
								onChange={(color: Color3) => this.onColorChange(color)}
								UpdateColorPickerBinding={(e) => this.updateColorPickerBinding(e)}
								OnClose={(inputButton: ImageButton) => this.HandleClick(inputButton)}
							/>
						</Portal>
					)}
				</GWFrame>
			</DragDropProvider>
		);
	}
}

export default connect((state: IState) => ({ Mode: state.PlacementSettings.BuildMode }))(ColorDisplay);
