import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Component, createBinding, RoactBinding, RoactBindingFunc } from "@rbxts/roact";
import TitleText from "client/components/misc/TitleText";
import GWFrame from "client/components/misc/GWFrame";
import DropdownButton from "./DropdownButton";
import ItemList from "./ItemList";

interface DropdownStateTypes<T> extends GWStateTypes<T> {
	Expanded: boolean;
}

interface DropdownPropTypes<T, V> extends GWPropTypes<T> {
	/**
	 * Values that will be displayed in Dropdown
	 **/
	Items: T[];
	/**
	 * Returns actual value from string passed.
	 **/
	GetValue: (value: V) => T;
}

class Dropdown<T extends Item, V extends string> extends Component<DropdownPropTypes<T, V>, DropdownStateTypes<T>> {
	private motor: SingleMotor;
	private binding: RoactBinding<number>;
	private setBinding: RoactBindingFunc<number>;

	public getDerivedStateFromProps = (
		nextProps: DropdownPropTypes<T, V>,
		currState: DropdownStateTypes<T>,
	): DropdownStateTypes<T> => {
		if (nextProps.Default !== currState.Value) {
			return {
				Expanded: currState.Expanded,
				Value: nextProps.Default,
			};
		} else {
			return currState;
		}
	};

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
		return (
			<GWFrame Name={this.props.Name} LayoutOrder={this.props.LayoutOrder} SizeOffsetY={25}>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<TitleText Text={this.props.Name} PosScaleY={0.5} />
				<ItemList
					Binding={this.binding}
					Items={this.props.Items}
					Handlers={{
						Activated: (e) => {
							const newValue = this.props.GetValue(e.Name as V);
							this.props.OnChange(newValue);
							this.setState((oldState) => ({
								...oldState,
								Value: newValue,
							}));
						},
					}}
				/>
				<DropdownButton
					Binding={this.binding}
					DisplayText={this.state.Value.Name}
					Handlers={{
						Activated: () => {
							this.motor.setGoal(new Spring(!this.state.Expanded ? 0 : 1));
							this.setState((oldState) => {
								return {
									...oldState,
									Expanded: !oldState.Expanded,
								};
							});
						},
					}}
				/>
			</GWFrame>
		);
	}
}

export default Dropdown;
