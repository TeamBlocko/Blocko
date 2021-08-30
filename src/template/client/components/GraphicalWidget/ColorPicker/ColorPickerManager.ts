import type Roact from "@rbxts/roact";

export const white = new Color3(1, 1, 1);
export const black = new Color3();

interface HSV {
	hue: number;
	saturation: number;
	value: number;
}

class ColorPickerManager {
	changeColor: (newState: ColorPickerStateTypes) => void;
	hsFrame: Roact.Ref<ImageButton>;
	valueFrame: Roact.Ref<TextButton>;
	state: ColorPickerStateTypes;
	props: ColorPickerPropTypes;
	hue = 0;
	saturation = 0;
	cvalue = 0;
	HFmouseDown = false;
	VFmouseDown = false;

	constructor(
		state: ColorPickerStateTypes,
		props: ColorPickerPropTypes,
		changeColor: (newState: ColorPickerStateTypes) => void,
		hsFrame: Roact.Ref<ImageButton>,
		valueFrame: Roact.Ref<TextButton>,
	) {
		this.state = state;
		this.props = props;
		this.changeColor = changeColor;
		this.hsFrame = hsFrame;
		this.valueFrame = valueFrame;
		this.updateHueSatFromColor();
	}

	RGBtoHSV(color: Color3): HSV {
		const [r, g, b] = [color.R, color.G, color.B];

		const max = math.max(r, g, b),
			min = math.min(r, g, b);
		let hue = 0;
		const value = max;

		const d = max - min;
		const saturation = max === 0 ? 0 : d / max;

		if (max === min) {
			hue = 0;
		} else {
			switch (max) {
				case r:
					hue = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					hue = (b - r) / d + 2;
					break;
				case b:
					hue = (r - g) / d + 4;
					break;
			}

			hue /= 6;
		}

		return { hue, saturation, value };
	}

	getHueBase(hue: number): Color3 {
		const sectorSize = 1 / 6;

		if (hue < sectorSize) {
			return new Color3(1, hue * 6, 0);
		} else if (hue < sectorSize * 2) {
			return new Color3(1 - (hue - sectorSize) * 6, 1, 0);
		} else if (hue < sectorSize * 3) {
			return new Color3(0, 1, (hue - sectorSize * 2) * 6);
		} else if (hue < sectorSize * 4) {
			return new Color3(0, 1 - (hue - sectorSize * 3) * 6, 1);
		} else if (hue < sectorSize * 5) {
			return new Color3((hue - sectorSize * 4) * 6, 0, 1);
		} else {
			return new Color3(1, 0, 1 - (hue - sectorSize * 5) * 6);
		}
	}

	updateColor() {
		const newState = { Value: Color3.fromHSV(this.hue, this.saturation, this.cvalue), ShouldUpdate: true };
		this.state = newState;
		this.changeColor(newState);
	}

	updateHueSatFromColor() {
		const HSV = this.RGBtoHSV(this.state.Value);
		this.hue = HSV.hue;
		this.saturation = HSV.saturation;
		this.cvalue = HSV.value;
	}

	getHSFramePosition(e?: GuiObject) {
		const element = e || this.hsFrame.getValue();
		if (element === undefined) {
			return new UDim2();
		}
		const xPos = this.hue * element.Size.X.Offset;
		const yPos = (1 - this.saturation) * element.Size.Y.Offset;
		return UDim2.fromOffset(xPos, yPos);
	}

	getValueFramePosition() {
		return new UDim2(this.cvalue, 0, 0, -4);
	}

	updateHue(xPos: number, yPos: number) {
		const element = this.hsFrame.getValue();
		if (element === undefined) return;

		const hue = xPos / element.Size.X.Offset;
		const saturation = 1 - yPos / element.Size.Y.Offset;
		this.hue = hue;
		this.saturation = saturation;
		return [hue, saturation];
	}

	updateValue(input: Vector3) {
		const element = this.valueFrame.getValue();
		if (element === undefined) return;
		const xPos = math.clamp(input.X - element.AbsolutePosition.X, 0, element.Size.X.Offset);
		const cvalue = xPos / element.Size.X.Offset;
		this.cvalue = cvalue;
		this.updateColor();
		return cvalue;
	}

	updateHueSat(input: Vector3) {
		const element = this.hsFrame.getValue();
		if (element === undefined) return;
		const xPos = math.clamp(input.X - element.AbsolutePosition.X, 0, element.Size.X.Offset);
		const yPos = math.clamp(input.Y - element.AbsolutePosition.Y, 0, element.Size.Y.Offset);

		this.updateHue(xPos, yPos);
		this.updateColor();

		return { xPos, yPos };
	}

	HandleInput(input: InputObject) {
		print("VISIBLE LOL", this.props.Visible);
		if (!this.props.Visible) return;
		if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			if (input.UserInputState === Enum.UserInputState.Begin) {
				const element = this.hsFrame.getValue();
				if (element === undefined) return;
				if (
					input.Position.X > element.AbsolutePosition.X &&
					input.Position.Y > element.AbsolutePosition.Y &&
					input.Position.X < element.AbsolutePosition.X + element.AbsoluteSize.X &&
					input.Position.Y < element.AbsolutePosition.Y + element.AbsoluteSize.Y
				) {
					this.updateHueSat(input.Position);
					this.HFmouseDown = true;
				}
			} else if (input.UserInputState === Enum.UserInputState.End) {
				this.HFmouseDown = false;
			}
		}
		if (this.HFmouseDown && input.UserInputState === Enum.UserInputState.Change) {
			this.updateHueSat(input.Position);
		}
	}

	HandleValueInput(input: InputObject) {
		if (!this.props.Visible) return;
		if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			if (input.UserInputState === Enum.UserInputState.Begin) {
				const element = this.valueFrame.getValue();
				if (element === undefined) return;
				if (
					input.Position.X > element.AbsolutePosition.X &&
					input.Position.Y > element.AbsolutePosition.Y &&
					input.Position.X < element.AbsolutePosition.X + element.AbsoluteSize.X &&
					input.Position.Y < element.AbsolutePosition.Y + element.AbsoluteSize.Y
				) {
					this.updateValue(input.Position);
					this.VFmouseDown = true;
				}
			} else if (input.UserInputState === Enum.UserInputState.End) {
				this.VFmouseDown = false;
			}
		}
		if (this.VFmouseDown && input.UserInputState === Enum.UserInputState.Change) {
			this.updateValue(input.Position);
		}
	}

	getColorSeq() {
		return new ColorSequence([
			new ColorSequenceKeypoint(0, new Color3()),
			new ColorSequenceKeypoint(1, white.Lerp(this.getHueBase(this.hue), this.saturation)),
		]);
	}
}

export default ColorPickerManager;
