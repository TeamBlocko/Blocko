import { Workspace } from "@rbxts/services";
import { DragDropProvider, DragDropContext } from "@rbxts/roact-dnd";
import Roact, { Component, Portal, createBinding, RoactBinding, RoactBindingFunc } from "@rbxts/roact";
import GWFrame from "client/components/misc/GWFrame";
import TitleText from "client/components/misc/TitleText";
import ColorPicker from "../ColorPicker";
import PickButton from "./PickButton";
import RGBValues from "./RGBValues";

import { getPosOnAxis } from "shared/utility";

const currentCamera = Workspace.CurrentCamera;

interface Action<A = any> {
	type: A;
}

type Binding = Frame | undefined;

class ColorDisplay extends Component<GWPropTypes<Color3>, ColorDisplayStateTypes<Color3>> {
	private root: ScreenGui | undefined;
	private colorPickerBinding: RoactBinding<Binding>;
	private updateColorPickerBinding: RoactBindingFunc<Binding>;
	private selfRef: Binding;
	private textChangedAllowed = true;
	private context: DragDropContext;

	constructor(props: GWPropTypes<Color3>) {
		super(props);
		[this.colorPickerBinding, this.updateColorPickerBinding] = createBinding<Binding>(undefined);
		this.setState({
			Selected: false,
		});
		const self = this;
		this.context = new DragDropContext();
		this.context.dispatch = (function (_: typeof DragDropContext, action: Action<string>) {
			print("DISPATCHED", action.type);
			switch (action.type) {
				case "DRAG/BEGIN":
					self.setColorPickerPos();
					break;
				case "DRAG/DRAGGING":
					self.setColorPickerPos();
					break;
			}
		} as unknown) as (action: Action) => void;
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

	shouldUpdate(nextProps: GWPropTypes<Color3>, nextState: ColorDisplayStateTypes<Color3>) {
		return tostring(nextProps.Default) !== tostring(this.props.Default) || nextState !== this.state;
	}

	onColorChange(color: Color3, isTextChanged?: boolean) {
		if (isTextChanged === true && this.textChangedAllowed === false) {
			return;
		}
		this.props.OnChange(color);
	}

	onTextChange(type: RGB, value: number): void {
		const rgb = { r: this.props.Default.r, g: this.props.Default.g, b: this.props.Default.b };
		rgb[type] = value / 255;
		this.onColorChange(new Color3(rgb.r, rgb.g, rgb.b), true);
	}

	render() {
		return (
			<DragDropProvider context={this.context}>
				<GWFrame SizeOffsetY={25}>
					<uicorner
						CornerRadius={new UDim(0, 7)}
						Ref={(n) => {
							if (!n) return;
							this.selfRef = n.Parent as Frame;
						}}
					/>
					<TitleText Text={this.props.Name} PosScaleY={0.5} />
					<PickButton
						Value={this.props.Default}
						HandleClick={(inputButton: TextButton) => {
							this.root = inputButton.FindFirstAncestorOfClass("ScreenGui");
							this.setState((oldState) => {
								return {
									...oldState,
									Selected: !oldState.Selected,
								};
							});
							this.setColorPickerPos();
						}}
					/>
					<RGBValues Value={this.props.Default} onTextChange={(...args) => this.onTextChange(...args)} />
					{this.state.Selected && this.root && (
						<Portal target={this.root}>
							<ColorPicker
								Name={this.props.Name}
								Value={this.props.Default}
								onChange={(color: Color3) => this.onColorChange(color)}
								UpdateColorPickerBinding={(e) => this.updateColorPickerBinding(e)}
							/>
						</Portal>
					)}
				</GWFrame>
			</DragDropProvider>
		);
	}
}

export default ColorDisplay;
