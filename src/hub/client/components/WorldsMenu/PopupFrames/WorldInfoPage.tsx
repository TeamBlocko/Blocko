import Roact from "@rbxts/roact";
import Flipper from "@rbxts/flipper";
import BottomFrame from "./BottomFrame";
import TopFrame from "./TopFrame";

import notificationStore from "common/client/notificationStore";

interface WorldInfoPagePropTypes {
	FrameRef: Roact.Ref<Frame>;
	OnNext: () => void;
	OnReturn: () => void;
	OnUpdate: (info: Info) => void;
	Info: Info;
}

interface Info {
	Name?: string;
	Description?: string;
}

interface MidFramePropTypes {
	OnUpdate: (info: Info) => void;
}

type Goal = {
	name: number;
	description: number;
};

class MidFrame extends Roact.Component<MidFramePropTypes, Info> {
	binding: Roact.Binding<Goal>;
	setBinding: Roact.BindingFunction<Goal>;

	motor: Flipper.GroupMotor<Goal>;

	constructor(props: MidFramePropTypes) {
		super(props);

		[this.binding, this.setBinding] = Roact.createBinding({ name: 0, description: 0 });

		this.motor = new Flipper.GroupMotor(this.binding.getValue());

		this.motor.onStep(this.setBinding);
	}

	render() {
		return (
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundTransparency={1}
				Position={UDim2.fromScale(0.5, 0.535)}
				Size={UDim2.fromScale(0.85, 0.5)}
			>
				<textbox
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 0.09)}
					Font={Enum.Font.Gotham}
					PlaceholderColor3={Color3.fromRGB(178, 178, 178)}
					PlaceholderText="Name"
					Text={this.state.Name ?? ""}
					TextColor3={new Color3(1, 1, 1)}
					TextSize={14}
					TextWrapped={true}
					ClearTextOnFocus={false}
					TextXAlignment={Enum.TextXAlignment.Left}
					Event={{
						Focused: () => this.motor.setGoal({ name: new Flipper.Spring(1, { frequency: 1 }) }),
						FocusLost: () => this.motor.setGoal({ name: new Flipper.Spring(0, { frequency: 1 }) }),
					}}
					Change={{
						Text: (e) => {
							const text = e.Text.sub(0, 66);
							print("Name", text, this.state.Name);
							this.setState((oldState) => ({ Name: text, Description: oldState.Description }));
						},
					}}
				>
					<frame
						AnchorPoint={new Vector2(0, 1)}
						BackgroundColor3={Color3.fromRGB(178, 178, 178)}
						Position={new UDim2(0, 0, 1, 5)}
						Size={new UDim2(1, 0, 0, 1)}
					>
						<uicorner CornerRadius={new UDim(1, 0)} />
						<frame
							BackgroundColor3={Color3.fromRGB(68, 161, 248)}
							Size={this.binding.map((value) => UDim2.fromScale(value.name, 1))}
						/>
					</frame>
				</textbox>
				<textbox
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={UDim2.fromScale(1, 0.09)}
					AutomaticSize={Enum.AutomaticSize.Y}
					Font={Enum.Font.Gotham}
					PlaceholderColor3={Color3.fromRGB(178, 178, 178)}
					PlaceholderText="Description"
					Text={this.state.Description ?? ""}
					TextColor3={new Color3(1, 1, 1)}
					TextSize={14}
					TextWrapped={true}
					ClearTextOnFocus={false}
					TextXAlignment={Enum.TextXAlignment.Left}
					Event={{
						Focused: () => this.motor.setGoal({ description: new Flipper.Spring(1, { frequency: 1 }) }),
						FocusLost: () => this.motor.setGoal({ description: new Flipper.Spring(0, { frequency: 1 }) }),
					}}
					Change={{
						Text: (e) => {
							const text = e.Text.sub(0, 216);
							print("Description", text, this.state.Description);
							this.setState((oldState) => ({ Name: oldState.Name, Description: text }));
						},
					}}
				>
					<frame
						AnchorPoint={new Vector2(0, 1)}
						BackgroundColor3={Color3.fromRGB(178, 178, 178)}
						Position={new UDim2(0, 0, 1, 5)}
						Size={new UDim2(1, 0, 0, 1)}
					>
						<uicorner CornerRadius={new UDim(1, 0)} />
						<frame
							BackgroundColor3={Color3.fromRGB(68, 161, 248)}
							Size={this.binding.map((value) => UDim2.fromScale(value.description, 1))}
						/>
					</frame>
				</textbox>
				<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0.125)} />
			</frame>
		);
	}

	shouldUpdate(_nextProps: MidFramePropTypes, nextState: Info) {
		return nextState.Name !== this.state.Name || nextState.Description !== this.state.Description;
	}

	didUpdate() {
		this.props.OnUpdate({
			Name: this.state.Name === "" ? undefined : this.state.Name,
			Description: this.state.Description === "" ? undefined : this.state.Description,
		});
	}
}

function WorldInfoPage(props: WorldInfoPagePropTypes) {
	return (
		<frame
			AnchorPoint={new Vector2(0.5, 0.5)}
			BackgroundTransparency={1}
			ClipsDescendants={true}
			Position={UDim2.fromScale(0.5, 0.5)}
			Size={UDim2.fromScale(1, 1)}
			Ref={props.FrameRef}
		>
			<TopFrame
				Title={"Edit Info"}
				Description={"Set a name and a description for your world, you can always change it later!"}
			/>
			<MidFrame OnUpdate={(info) => props.OnUpdate(info)} />
			<BottomFrame
				Button1Click={() => props.OnReturn()}
				Button1Text={"Return"}
				Button2Click={() => props.OnNext()}
				Button2Text={"Next"}
			/>
		</frame>
	);
}

export default WorldInfoPage;
