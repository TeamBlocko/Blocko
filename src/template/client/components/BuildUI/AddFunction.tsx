import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { createFunctionality } from "template/shared/Functionalities";
import { getAvliableFunctionalities } from "./FunctionalityUtility";
import { addFunctionality } from "template/client/rodux/placementSettings";
import Rodux from "@rbxts/rodux";
import { StoreActions } from "template/client/store";

interface AddFunctionProps extends MappedDispatch {
	LayoutOrder?: number;
}

interface MappedDispatch {
	addFunctionality: () => void;
}

class AddFunction extends Roact.PureComponent<AddFunctionProps> {
	render() {
		return (
			<textbutton
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={0.9}
				Size={new UDim2(0.975, 0, 0, 25)}
				Text=""
				LayoutOrder={this.props.LayoutOrder}
				Event={{
					Activated: () => this.props.addFunctionality(),
				}}
			>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<imagelabel
					AnchorPoint={new Vector2(0.5, 0.5)}
					BackgroundTransparency={1}
					Size={UDim2.fromOffset(20, 20)}
					Image="rbxassetid://3926307971"
					ImageRectOffset={new Vector2(324, 364)}
					ImageRectSize={new Vector2(36, 36)}
				/>
				<textlabel
					BackgroundTransparency={1}
					ClipsDescendants={true}
					Size={UDim2.fromOffset(0, 11)}
					Font={Enum.Font.GothamBold}
					Text="Add Function"
					TextColor3={new Color3(1, 1, 1)}
					TextScaled={true}
					TextSize={12}
					TextWrapped={true}
				/>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>
			</textbutton>
		);
	}
}

const mapDispatchToProps = (dispatch: Rodux.Dispatch<StoreActions>): MappedDispatch => {
	return {
		addFunctionality: () => {
			const newFunctionality = createFunctionality(getAvliableFunctionalities()[0]);
			dispatch(addFunctionality(newFunctionality));
		},
	};
};

export default connect(undefined, mapDispatchToProps)(AddFunction);
