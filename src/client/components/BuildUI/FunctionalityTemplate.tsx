import Roact from "@rbxts/roact"
import { connect } from "@rbxts/roact-rodux"
import { values } from "@rbxts/object-utils"
import Slider from "../GraphicalWidget/Slider";
import Dropdown from "../GraphicalWidget/Dropdown"
import * as Functionalities from "shared/Functionalities"
import { getAvliableFunctionalities } from "./FunctionalityUtility";
import { updateFunctionality, updateFunctionalityProperty } from "client/rodux/placementSettings"
import { IState, PlacementSettings} from "shared/Types";

interface FunctionTemplatePropTypes extends PlacementSettings {
	Functionality: Functionalities.FunctionalitiesInstances;
	LayoutOrder?: number;
	UpdateFunctionality(this: FunctionTemplatePropTypes, value: Functionalities.FunctionalitiesValues): void;
	UpdateFunctionalityProperty(this: FunctionTemplatePropTypes, property: string, value: number): void;
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
						values( Functionalities.functionalities).find(functionality => functionality.Name === value) ?? props.Functionality
					}
					Default={props.Functionality as Functionalities.FunctionalitiesValues }
					OnChange={(value) => props.UpdateFunctionality(value)}
				/>
				{
					(values(props.Functionality.Properties) as Functionalities.FunctionalitiesPropertiesInstance[]).map(property => {
						switch (property.Type) {
							case "number":
								return <Slider {...property} SizeYOffset={55} Default={property.Current} OnChange={(value) => {
										props.UpdateFunctionalityProperty(property.Name, value)
								}} />
						}
					})
				}
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
		UpdateFunctionality(this: FunctionTemplatePropTypes, value: Functionalities.FunctionalitiesValues) {
			
			const newFunctionality = Functionalities.createFunctionality(value, { GUID: this.Functionality.GUID })

			dispatch(
				updateFunctionality(
					this.Functionality.GUID,
					newFunctionality as Functionalities.FunctionalitiesInstances
				)
			)
		},
		UpdateFunctionalityProperty(this: FunctionTemplatePropTypes, property: string, value: number) {
			dispatch(
				updateFunctionalityProperty(
					this.Functionality.GUID,
					property,
					value
				)
			)
		}
	})
)(FunctionTemplate)