import { HttpService, TextService } from "@rbxts/services";
import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Component, createBinding, RoactBinding, RoactBindingFunc } from "@rbxts/roact";
import ItemList from "./ItemList";

interface DropdownStateTypes<T> extends GWStateTypes<T> {
	Expanded: boolean;
}

/*
interface DropdownButton<T> extends ItemListPropTypes<T> {
	DisplayText: string;
	OnClicked: NonNullable<RoactEvents<TextButton>["Activated"]>;
	Binding: RoactBinding<number>;
}
*/

export interface DropdownPropTypes<T, V> extends GWPropTypes<T> {
	/**
	 * Values that will be displayed in Dropdown
	 **/
	Items: T[];
	/**
	 * Returns actual value from string passed.
	 **/
	GetValue: (value: V) => T;

	ZIndex?: number;
	Position?: UDim2;
	OverrideValueText?: string;
	ResizeButtonToText?: boolean;
	OnExtend?: (isExpanded: boolean) => void;
}

class DropdownButton<T extends Item, V extends string> extends Component<
	DropdownPropTypes<T, V>,
	DropdownStateTypes<T>
> {
	private motor: SingleMotor;
	private binding: RoactBinding<number>;
	private setBinding: RoactBindingFunc<number>;

	public getDerivedStateFromProps = (
		nextProps: DropdownPropTypes<T, V>,
		currState: DropdownStateTypes<T>,
	): DropdownStateTypes<T> => {
		if (nextProps.Default !== currState.Value) {
			return {
				Value: nextProps.Default,
				Expanded: currState.Expanded,
			};
		} else {
			return currState;
		}
	};

	id = HttpService.GenerateGUID();

	constructor(props: DropdownPropTypes<T, V>) {
		super(props);
		this.motor = new SingleMotor(0);
		[this.binding, this.setBinding] = createBinding(this.motor.getValue());

		this.motor.onStep(this.setBinding);

		this.setState({
			Value: props.Default,
			Expanded: false,
		});
	}

	shouldUpdate(nextProps: DropdownPropTypes<T, V>, nextState: DropdownStateTypes<T>) {
		const shouldUpdate = nextProps.Default.Name !== this.props.Default.Name || nextState !== this.state;
		if (shouldUpdate) {
			this.state.Value = nextProps.Default;
		}
		return shouldUpdate;
	}

	render() {
		const buttonText = this.props.OverrideValueText ?? this.props.Default.Name;
		const size = TextService.GetTextSize(buttonText, 12, Enum.Font.GothamBold, new Vector2(0, 0)).X + 20;
		return (
			<textbutton
				AnchorPoint={new Vector2(0, 0.5)}
				BackgroundTransparency={1}
				Position={this.props.Position ?? UDim2.fromScale(0.795, 0.5)}
				Size={UDim2.fromScale(0.16, 0.35)}
				Font={Enum.Font.GothamBold}
				AutoButtonColor={false}
				Text={buttonText}
				TextColor3={Color3.fromRGB(185, 185, 185)}
				TextSize={14}
				TextXAlignment={Enum.TextXAlignment.Left}
				ZIndex={this.props.ZIndex}
				Event={{
					Activated: () => {
						this.setState((prevState) => ({ Expanded: !prevState.Expanded, Value: prevState.Value }));
					},
				}}
			>
				<imagelabel
					AnchorPoint={new Vector2(1, 0.5)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(1, 0.5)}
					Size={UDim2.fromScale(0.31, 1.21)}
					ZIndex={2}
					Rotation={this.binding.map((value) => value * 90)}
					ImageColor3={this.binding.map((value) =>
						Color3.fromRGB(163, 162, 165).Lerp(Color3.fromRGB(66, 126, 193), value),
					)}
					Image="rbxassetid://3926305904"
					ImageRectOffset={new Vector2(924, 884)}
					ImageRectSize={new Vector2(36, 36)}
					ScaleType={Enum.ScaleType.Fit}
				/>
				<ItemList
					Binding={this.binding}
					Items={this.props.Items}
					Expanded={this.state.Expanded}
					SizeX={this.props.OverrideValueText ? size : 135}
					OnSelected={(e) => {
						const newValue = this.props.GetValue(e.Name as V);
						this.props.OnChange(newValue);
						this.setState((prevState) => ({
							Expanded: !prevState.Expanded,
							Value: newValue,
						}));
					}}
				/>
				<uicorner CornerRadius={new UDim(0, 5)} />
			</textbutton>
		);
	}

	didUpdate() {
		this.motor.setGoal(new Spring(this.state.Expanded ? 1 : 0));
	}
}

export default DropdownButton;
