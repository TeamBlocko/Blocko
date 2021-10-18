import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { values } from "@rbxts/object-utils";
import Slider from "../GraphicalWidget/Slider";
import DropdownButton from "../GraphicalWidget/Dropdown/DropdownButton";
import Dropdown from "../GraphicalWidget/Dropdown";
import * as Functionalities from "template/shared/Functionalities";
import { FunctionalitiesPropertiesInstance } from "template/shared/Functionalities";
import { getAvliableFunctionalities } from "./FunctionalityUtility";
import {
	updateFunctionality,
	updateFunctionalityProperty,
	removeFunctionality,
} from "template/client/rodux/placementSettings";
import CloseButton from "../misc/CloseButton";
import TitleText from "../misc/TitleText";
import Gap from "common/client/components/misc/Gap";
import Rodux from "@rbxts/rodux";
import { StoreActions } from "template/client/store";
import { NumberInput } from "../GraphicalWidget/NumberInput";
import ObjectPicker from "../GraphicalWidget/ObjectPicker";

interface FunctionTemplatePropTypes extends MappedDispatch {
	Functionality: Functionalities.FunctionalitiesInstancesValues;
	LayoutOrder?: number;
	ZIndex?: number;
}

interface MappedDispatch {
	UpdateFunctionality: (guid: string, value: Functionalities.FunctionalitiesValues) => void;
	UpdateFunctionalityProperty: (
		guid: string,
		property: Functionalities.FunctionalitiesPropertiesNames,
		value: Functionalities.FunctionalitiesPropertiesValueTypes,
	) => void;
	RemoveFunctionality: (guid: string) => void;
}

function renderFunctionalitySettings(props: FunctionTemplatePropTypes) {
	return (values(props.Functionality.Properties) as FunctionalitiesPropertiesInstance[]).map((property) => {
		switch (property.Type) {
			case "slider":
				return (
					<Slider
						{...property}
						SizeYOffset={55}
						Default={property.Current}
						BackgroundTransparency={1}
						OnChange={(value) => {
							props.UpdateFunctionalityProperty(props.Functionality.GUID, property.Name, value);
						}}
					/>
				);
			case "choice":
				return (
					<Dropdown
						{...property}
						Default={property.Current}
						BackgroundTransparency={1}
						GetValue={(value) => property.Items.find((item) => item.Name === value)!}
						OnChange={(value) => {
							props.UpdateFunctionalityProperty(props.Functionality.GUID, property.Name, value);
						}}
						Position={new UDim2(0.7, 0, 0, 25)}
						ResizeForDropdown={true}
					/>
				);
			case "input":
				return (
					<NumberInput
						{...property}
						BackgroundTransparency={1}
						OnChange={(value) => {
							props.UpdateFunctionalityProperty(props.Functionality.GUID, property.Name, value);
						}}
					/>
				);
			case "block":
				return (
					<ObjectPicker
						{...property}
						BackgroundTransparency={1}
						OnChange={(value) => {
							props.UpdateFunctionalityProperty(props.Functionality.GUID, property.Name, value);
						}}
					/>
				)
		}
	});
}

class FunctionTemplate extends Roact.PureComponent<FunctionTemplatePropTypes, { Visible: boolean }> {
	frameRef: Roact.Ref<Frame>;

	frameSizeBinding: Roact.Binding<number>;
	setFrameSizeBinding: Roact.BindingFunction<number>;

	constructor(props: FunctionTemplatePropTypes) {
		super(props);

		this.frameRef = Roact.createRef();

		[this.frameSizeBinding, this.setFrameSizeBinding] = Roact.createBinding(0);

		this.setState({
			Visible: true,
		});
	}

	render() {
		const settings = renderFunctionalitySettings(this.props);
		const items = getAvliableFunctionalities().filter((func) => func.Id !== this.props.Functionality.Id);
		return (
			<frame
				Key={this.props.Functionality.GUID}
				BackgroundColor3={new Color3(1, 1, 1)}
				BackgroundTransparency={0.95}
				Size={this.frameSizeBinding.map((value) => new UDim2(0.975, 0, 0, value))}
				ZIndex={this.props.ZIndex}
				LayoutOrder={this.props.LayoutOrder}
				Ref={this.frameRef}
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
					<DropdownButton
						Name="Functionality"
						Items={items}
						GetValue={(value) =>
							values(Functionalities.functionalities).find(
								(functionality) => functionality.Name === value,
							) ?? this.props.Functionality
						}
						ZIndex={11}
						Default={this.props.Functionality as Functionalities.FunctionalitiesValues}
						OnChange={(value) => this.props.UpdateFunctionality(this.props.Functionality.GUID, value)}
						IgnoreClipDescandents={true}
						Visible={this.state.Visible}
					/>
					<Gap Width={40} />
					<CloseButton OnClose={() => this.props.RemoveFunctionality(this.props.Functionality.GUID)} />
					<uilistlayout
						FillDirection={Enum.FillDirection.Horizontal}
						HorizontalAlignment={Enum.HorizontalAlignment.Center}
						VerticalAlignment={Enum.VerticalAlignment.Center}
					/>
				</frame>
				{settings.size() > 0 ? (
					<TitleText Text={"Functionality Settings"} Size={UDim2.fromOffset(180, 14)} />
				) : undefined}
				{settings}
				<uilistlayout
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Change={{ AbsoluteContentSize: (e) => this.setFrameSizeBinding(e.AbsoluteContentSize.Y) }}
				/>
			</frame>
		);
	}

	didMount() {
		const frame = this.frameRef.getValue();
		print(frame);
		if (!frame) return;
		const scrollingFrame = frame.FindFirstAncestorOfClass("ScrollingFrame");
		print(scrollingFrame);
		if (!scrollingFrame) return;
		scrollingFrame.GetPropertyChangedSignal("CanvasPosition").Connect(() => {
			this.setState({
				Visible: frame.AbsolutePosition.Y + 35 < scrollingFrame.CanvasSize.Y.Offset,
			});
		});
	}
}

const mapDispatchToProps = (dispatch: Rodux.Dispatch<StoreActions>): MappedDispatch => {
	return {
		UpdateFunctionality: (guid: string, value: Functionalities.FunctionalitiesValues) => {
			const newFunctionality = Functionalities.createFunctionality(value, { GUID: guid });

			dispatch(updateFunctionality(guid, newFunctionality as Functionalities.FunctionalitiesInstancesValues));
		},
		UpdateFunctionalityProperty: (
			guid: string,
			property: Functionalities.FunctionalitiesPropertiesNames,
			value: Functionalities.FunctionalitiesPropertiesValueTypes,
		) => {
			dispatch(updateFunctionalityProperty(guid, property, value));
		},
		RemoveFunctionality: (guid: string) => {
			dispatch(removeFunctionality(guid));
		},
	};
};

export default connect(undefined, mapDispatchToProps)(FunctionTemplate);
