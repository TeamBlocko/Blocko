import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { values } from "@rbxts/object-utils";
import Slider from "../GraphicalWidget/Slider";
import Dropdown from "../GraphicalWidget/Dropdown/DropdownButton";
import * as Functionalities from "template/shared/Functionalities";
import { getAvliableFunctionalities } from "./FunctionalityUtility";
import {
	updateFunctionality,
	updateFunctionalityProperty,
	removeFunctionality,
} from "template/client/rodux/placementSettings";
import { IState, PlacementSettings } from "template/shared/Types";
import CloseButton from "../misc/CloseButton";
import TitleText from "../misc/TitleText";
import Gap from "../misc/Gap";

interface FunctionTemplatePropTypes extends PlacementSettings {
	Functionality: Functionalities.FunctionalitiesInstances;
	LayoutOrder?: number;
	ZIndex?: number;
	UpdateFunctionality(guid: string, value: Functionalities.FunctionalitiesValues): void;
	UpdateFunctionalityProperty(
		guid: string,
		property: Functionalities.FunctionalitiesPropertiesNames,
		value: number,
	): void;
	RemoveFunctionality(guid: string): void;
}

function renderFunctionalitySettings(props: FunctionTemplatePropTypes) {
	return (
		(values(props.Functionality.Properties) as Functionalities.FunctionalitiesPropertiesInstance[]).map(
				(property) => {
					switch (property.Type) {
						case "number":
							return (
								<Slider
									{...property}
									SizeYOffset={55}
									Default={property.Current}
									BackgroundTransparency={1}
									OnChange={(value) => {
										props.UpdateFunctionalityProperty(
											props.Functionality.GUID,
											property.Name,
											value,
										);
									}}
								/>
							);
					}
				},
			)
	)
};

class FunctionTemplate extends Roact.Component<FunctionTemplatePropTypes> {

	uilistRef: Roact.Ref<UIListLayout>

	constructor(props: FunctionTemplatePropTypes) {
		super(props)

		this.uilistRef = Roact.createRef()
	}

	render() {
		const settings = renderFunctionalitySettings(this.props)
		return (
			<frame
				Key={this.props.Functionality.GUID}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={0.95}
				Size={new UDim2(0.975, 0, 0, 35)}
				ZIndex={this.props.ZIndex}
				LayoutOrder={this.props.LayoutOrder}
			>
				<uicorner CornerRadius={new UDim(0, 7)} />
				<frame
					AnchorPoint={new Vector2(0.5, 0)}
					BackgroundTransparency={1}
					BorderColor3={new Color3()}
					BorderSizePixel={0}
					ZIndex={11}
					Position={UDim2.fromScale(0.5, 0.025)}
					Size={new UDim2(1, 0, 0, 35)}
				>
					<Dropdown
						Name="Functionality"
						Items={getAvliableFunctionalities()}
						GetValue={(value) =>
							values(Functionalities.functionalities).find((functionality) => functionality.Name === value) ??
							this.props.Functionality
						}
						ZIndex={11}
						Default={this.props.Functionality as Functionalities.FunctionalitiesValues}
						OnChange={(value) => this.props.UpdateFunctionality(this.props.Functionality.GUID, value)}
					/>
					<Gap Width={40} />
					<CloseButton OnClose={() => this.props.RemoveFunctionality(this.props.Functionality.GUID)} />
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					/>
				</frame>
				{ settings.size() > 0 ?
					<TitleText
						Text={"Functionality Settings"}
						TextXAlignment={Enum.TextXAlignment.Center}
						Size={UDim2.fromOffset(180, 14)}
					/>
					: undefined
				}
				{settings}
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Ref={this.uilistRef}
				/>
			</frame>
		);
	}

	didMount() {
		const uilist = this.uilistRef.getValue();
		if (!uilist) return;

		const parent = uilist.Parent as Frame;
		parent.Size = new UDim2(0.975, 0, 0, uilist.AbsoluteContentSize.Y);
		uilist.GetPropertyChangedSignal("AbsoluteContentSize").Connect(() => {
			parent.Size = new UDim2(0.975, 0, 0, uilist.AbsoluteContentSize.Y);
		});
	}
}

export default connect(
	(state: IState) => state.PlacementSettings,
	(dispatch) => ({
		UpdateFunctionality(guid: string, value: Functionalities.FunctionalitiesValues) {
			const newFunctionality = Functionalities.createFunctionality(value, { GUID: guid });

			dispatch(updateFunctionality(guid, newFunctionality as Functionalities.FunctionalitiesInstances));
		},
		UpdateFunctionalityProperty(
			guid: string,
			property: Functionalities.FunctionalitiesPropertiesNames,
			value: number,
		) {
			dispatch(updateFunctionalityProperty(guid, property, value));
		},
		RemoveFunctionality(guid: string) {
			dispatch(removeFunctionality(guid));
		},
	}),
)(FunctionTemplate);
