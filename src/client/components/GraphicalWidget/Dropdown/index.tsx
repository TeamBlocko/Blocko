import { SingleMotor, Spring } from "@rbxts/flipper";
import Roact, { Component, createBinding, RoactBinding, RoactBindingFunc } from "@rbxts/roact";
import TitleText from "client/components/TitleText";
import GWContainer from "client/components/GWContainer";
import DropdownButton from "./DropdownButton";
import ItemList from "./ItemList";

class Dropdown<T extends Item> extends Component<DropdownPropTypes<T>, GWStateTypes<T> & { Expanded: boolean }> {
	motor: SingleMotor;
	binding: RoactBinding<number>;
	setBinding: RoactBindingFunc<number>;

	constructor(props: DropdownPropTypes<T>) {
		super(props);
		this.motor = new SingleMotor(0);
		[this.binding, this.setBinding] = createBinding(this.motor.getValue());

		this.motor.onStep(this.setBinding);

		this.setState({
			Value: props.Default,
			Expanded: false,
		});
	}

	render() {
		return (
			<GWContainer Name={this.props.Name} LayoutOrder={this.props.LayoutOrder} SizeOffsetY={25}>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<TitleText Text={this.props.Name} PosScaleY={0.5} />
				<ItemList
					Binding={this.binding}
					Items={this.props.Items}
					Handlers={{
						Activated: (e) => {
							const newValue = this.props.GetValue(e.Name);
							this.props.OnChange(newValue);
							this.setState((oldState) => {
								return {
									...oldState,
									Value: newValue,
								};
							});
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
			</GWContainer>
		);
	}
}

export default Dropdown;
