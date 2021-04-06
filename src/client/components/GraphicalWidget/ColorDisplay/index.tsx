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

interface Action<A> {
	type: A;
}

type Binding = Frame | undefined;

class ColorDisplay extends Component<GWPropTypes<Color3> & { SizeYOffset?: number }, ColorDisplayStateTypes<Color3>> {
	private root: ScreenGui | undefined;
	private colorPickerBinding: RoactBinding<Binding>;
	private updateColorPickerBinding: RoactBindingFunc<Binding>;
	private selfRef: Binding;
	private textChangedAllowed = true;
	private context: DragDropContext;

	constructor(props: GWPropTypes<Color3> & { SizeYOffset?: number }) {
		super(props);
		[this.colorPickerBinding, this.updateColorPickerBinding] = createBinding<Binding>(undefined);
		this.setState({
			Selected: false,
		});
		this.context = new DragDropContext();
		this.context.dispatch = (((_: typeof DragDropContext, action: Action<string>) => {
			print("DISPATCHED", action.type);
			switch (action.type) {
				case "DRAG/BEGIN":
					this.setColorPickerPos();
					break;
				case "DRAG/DRAGGING":
					this.setColorPickerPos();
					break;
			}
		}) as unknown) as (action: Action<string>) => void;
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
			<DragDropProvider context={this.context}>
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
					{this.state.Selected && this.root && (
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

export default ColorDisplay;
