import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import Rodux from "@rbxts/rodux";
import { ContextActionService, HttpService } from "@rbxts/services";
import { updatePickerActivated } from "template/client/rodux/updatePicker";
import { StoreActions } from "template/client/store";
import { IState } from "template/shared/Types";
import { getTopPart } from "template/shared/utility";
import GWFrame from "../misc/GWFrame";
import TitleText from "../misc/TitleText";

interface ObjectPickerButtonPropTypes extends GWPropTypes<string | undefined>, MappedProps, MappedDispatch {
	SizeYOffset?: number;
	BackgroundTransparency?: number;
}

interface MappedProps {
	ActivatedId?: string;
}

interface MappedDispatch {
	UpdatePickerActivated: (activated?: string | undefined) => void;
}

export class ObjectPicker extends Roact.PureComponent<ObjectPickerButtonPropTypes> {
	Id: string;

	constructor(props: ObjectPickerButtonPropTypes) {
		super(props);
		this.Id = HttpService.GenerateGUID();
	}

	render() {
		return (
			<GWFrame
				SizeOffsetY={this.props.SizeYOffset ?? 30}
				LayoutOrder={this.props.LayoutOrder}
				BackgroundTransparency={this.props.BackgroundTransparency}
			>
				<TitleText
					Text={this.props.Name}
				/>
				<textbutton
					Text={this.props.ActivatedId === this.Id ? "Select Object" : this.props.Default ?? "No Target"}
					BackgroundTransparency={0.925}
					TextColor3={new Color3(1, 1, 1)}
					AnchorPoint={new Vector2(1, 0.5)}
					Position={UDim2.fromScale(0.925, 0.5)}
					Font={Enum.Font.Gotham}
					Size={UDim2.fromOffset(40, 20)}
					TextSize={16}
					AutomaticSize={Enum.AutomaticSize.X}
					Event={{
						Activated: () => {
							const newValue = !this.props.ActivatedId ? this.Id : undefined;
							this.props.UpdatePickerActivated(newValue);
						}
					}}
				/>
			</GWFrame>
		);
	}

	didMount() {
		ContextActionService.BindActionAtPriority(
			"ColorPicker",
			(_, inputState) => {
				if (this.props.ActivatedId !== this.Id) return Enum.ContextActionResult.Pass;
				if (inputState === Enum.UserInputState.Begin) {
					const target = getTopPart(1e5);
					if (!target) return Enum.ContextActionResult.Pass;
					this.props.UpdatePickerActivated();
					this.props.OnChange(target.Name);
				}
				return Enum.ContextActionResult.Pass;
			},
			false,
			1,
			Enum.UserInputType.MouseButton1,
		);
	}
}

const mapStateToProps = (state: IState, _props: ObjectPickerButtonPropTypes): MappedProps => {
	return {
		ActivatedId: state.ActivatedPicker,
	};
};

const mapDispatchToProps = (dispatch: Rodux.Dispatch<StoreActions>): MappedDispatch => {
	return {
		UpdatePickerActivated: (activated?: string | undefined) => {
			dispatch(updatePickerActivated(activated));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ObjectPicker);
