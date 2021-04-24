import { HttpService, TextService } from "@rbxts/services";
import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Component, createBinding, RoactBinding, RoactBindingFunc } from "@rbxts/roact";
import ItemList from "./ItemList";
import { appContext } from "template/client/appContext";

interface DropdownStateTypes<T> extends GWStateTypes<T> {}

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
		return (
			<appContext.Consumer
				render={(value) => {
					const buttonText = this.props.OverrideValueText ?? this.props.Default.Name;
					const size =
						TextService.GetTextSize(buttonText, 12, Enum.Font.GothamBold, new Vector2(0, 0)).X + 20;
					const isSelected = value.OpenDropdown === this.id;
					this.motor.setGoal(new Spring(!isSelected ? 0 : 1));
					return (
						<textbutton
							AnchorPoint={new Vector2(1, 0)}
							BackgroundColor3={Color3.fromRGB(60, 60, 60)}
							Position={
								this.props.Position ?? new UDim2(0.98, 0, 0, this.props.Name.size() < 9 ? 3 : 25)
							}
							Size={UDim2.fromOffset(this.props.OverrideValueText ? size : 135, 18)}
							Font={Enum.Font.GothamBold}
							AutoButtonColor={false}
							Text={`  ${buttonText}`}
							TextColor3={Color3.fromRGB(217, 217, 217)}
							TextSize={12}
							TextXAlignment={Enum.TextXAlignment.Left}
							ZIndex={this.props.ZIndex}
							Event={{
								Activated: () => {
									if (isSelected) {
										value.changeDropdown(Roact.None);
										this.props.OnExtend?.(false);
									} else {
										value.changeDropdown(this.id);
										this.props.OnExtend?.(true);
									}
								},
							}}
						>
							<imagelabel
								AnchorPoint={new Vector2(0.5, 0.5)}
								BackgroundTransparency={1}
								Position={UDim2.fromScale(0.925, 0.5)}
								Size={UDim2.fromOffset(18, 18)}
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
								SizeX={this.props.OverrideValueText ? size : 135}
								OnSelected={(e) => {
									const newValue = this.props.GetValue(e.Name as V);
									this.props.OnChange(newValue);
									value.changeDropdown(Roact.None);
									this.props.OnExtend?.(false);
									this.setState({
										Value: newValue,
									});
								}}
							/>
							<uicorner CornerRadius={new UDim(0, 5)} />
						</textbutton>
					);
				}}
			/>
		);
	}
}

export default DropdownButton;
