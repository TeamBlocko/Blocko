import Roact from "@rbxts/roact"
import { connect } from "@rbxts/roact-rodux"
import { deepCopy, assign } from "@rbxts/object-utils"
import Slider from "../GraphicalWidget/Slider";
import CheckBox from "../GraphicalWidget/CheckBox";
import Dropdown from "../GraphicalWidget/Dropdown"
import functionalities from "./Functionalities"
import { getAvliableFunctionalities } from "./FunctionalityUtility";
import { updateSetting } from "client/rodux/placementSettings"

interface FunctionTemplatePropTypes extends PlacementSettings {
	Functionality: FunctionalityInstance;
	LayoutOrder?: number;
	UpdateFunctionality(this: FunctionTemplatePropTypes, value: Functionality): void;
}

function FunctionTemplate(props: FunctionTemplatePropTypes) {
	return (
			<frame
				Key={props.Functionality.GUID}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={0.95}
				Size={new UDim2(0.975, 0, 0, 25)}
				LayoutOrder={props.LayoutOrder}
			>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<Dropdown
					Name="Functionality"
					Items={getAvliableFunctionalities()}
					GetValue={value => 
						functionalities.find(functionality => functionality.Name === value) ?? props.Functionality
					}
					Default={props.Functionality}
					OnChange={(value) => props.UpdateFunctionality(value)}
				/>
				<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Ref={
					(e) => {
						if (!e) return;

						const parent = e.Parent as Frame
						parent.Size = new UDim2(1, 0, 0, e.AbsoluteContentSize.Y) 
					}
				} />
			</frame>
		)
}

export default connect(
	(state: IState) => state.PlacementSettings,
	(dispatch) => ({
		UpdateFunctionality(this: FunctionTemplatePropTypes, value: Functionality) {
			const functionalityCopy = deepCopy(value)
			const newFunctionalities = deepCopy(this.Functionalities)

			const newFunctionality = assign(functionalityCopy, {
				GUID: this.Functionality.GUID
			})

			const functionalityIndex = this.Functionalities.findIndex((value) => value.GUID === newFunctionality.GUID)
		
			newFunctionalities[functionalityIndex] = newFunctionality

			dispatch(
				updateSetting({
					settingName: "Functionalities",
					value: newFunctionalities
				})
			)
		}
	})
)(FunctionTemplate)