import { SingleMotor } from "@rbxts/flipper";
import Roact, { Component, createBinding, RoactBinding } from "@rbxts/roact";
import TitleText from "../../TitleText";
import DropdownButton from "./DropdownButton";
import ItemList from "./ItemList";

class Dropdown<T extends Item> extends Component<
	DropdownPropTypes<T>,
	GWStateTypes<T> & { Expanded: boolean }
> {
	motor: SingleMotor;
	binding: RoactBinding<number>;

	constructor(props: DropdownPropTypes<T>) {
		super(props);
		this.motor = new SingleMotor(0);
		[this.binding] = createBinding(this.motor.getValue());

		this.setState({
			Value: props.Default,
			Expanded: false,
		});
	}

	render() {
		return (
			<frame
				Key={this.props.Name}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={0.95}
				Size={new UDim2(0.975, 0, 0, 25)}
				ZIndex={10}
				LayoutOrder={this.props.LayoutOrder}
			>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<TitleText Name={this.props.Name} />
				<ItemList
					Expanded={this.state.Expanded}
					Items={this.props.Items}
					Handlers={{
						Activated: (e) => {
							this.setState((oldState) => {
								return {
									...oldState,
									Value: this.props.Handlers.GetValue(e.Name),
								};
							});
						},
					}}
				/>
				<DropdownButton
					Expanded={this.state.Expanded}
					DisplayText={this.state.Value.Name}
					Handlers={{
						Activated: () =>
							this.setState((oldState) => {
								return {
									...oldState,
									Expanded: !oldState.Expanded,
								};
							}),
					}}
				/>
			</frame>
		);
	}
}

export default Dropdown;
