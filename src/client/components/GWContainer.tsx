import { ReplicatedStorage } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { updateProperty } from "client/rodux/placementSettings";
import ElementSeperator from "./misc/ElementSperator";
import Dropdown from "./GraphicalWidget/Dropdown";
import Slider from "./GraphicalWidget/Slider";
import CheckBox from "./GraphicalWidget/CheckBox";
import ColorDisplay from "./GraphicalWidget/ColorDisplay";

interface GWContainerPropTypes extends PlacementSettings {
	OnSliderUpdate(propertyName: string, value: number): void;
	OnDropdownUpdate(propertyName: string, value: Instance | Enum.Material): void;
	OnCheckBoxUpdate(propertyName: string, value: boolean): void;
	OnColorPickerUpdate(propertyName: string, value: Color3): void;
}

const Shapes = ReplicatedStorage.BlockTypes;

function GWContainer(props: GWContainerPropTypes) {
	return (
		<scrollingframe
			AnchorPoint={new Vector2(0.5, 1)}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			Position={UDim2.fromScale(0.5, 1)}
			Size={UDim2.fromScale(0.96, 1)}
			ScrollBarImageTransparency={0.9}
			ScrollBarThickness={4}
			VerticalScrollBarInset={Enum.ScrollBarInset.Always}
		>
			<uilistlayout
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				SortOrder={Enum.SortOrder.LayoutOrder}
				Padding={new UDim(0, 3)}
			/>
			<frame Size={UDim2.fromOffset(0, 5)} LayoutOrder={-2} />
			<ElementSeperator LayoutOrder={-1} />
			<Dropdown
				Name="Shape"
				Default={props.Shape}
				LayoutOrder={0}
				Items={Shapes.GetChildren()}
				OnChange={(newValue: Instance) => props.OnDropdownUpdate("Shape", newValue)}
				GetValue={(value: keyof typeof Shapes) => Shapes[value] as Instance}
			/>
			<Dropdown
				Name="Material"
				Default={props.RawProperties.Material}
				LayoutOrder={1}
				Items={Enum.Material.GetEnumItems()}
				OnChange={(newValue: Enum.Material) => props.OnDropdownUpdate("Material", newValue)}
				GetValue={(value: keyof Omit<typeof Enum.Material, "GetEnumItems">) => Enum.Material[value]}
			/>
			<ColorDisplay
				Name="Color"
				LayoutOrder={2}
				Default={props.RawProperties.Color}
				OnChange={(newValue: Color3) => props.OnColorPickerUpdate("Color", newValue)}
			/>
			<Slider
				Name="Transparency"
				LayoutOrder={3}
				Default={props.RawProperties.Transparency}
				Min={0}
				Max={10}
				OnChange={(newValue: number) => props.OnSliderUpdate("Transparency", newValue)}
			/>
			<Slider
				Name="Reflectance"
				LayoutOrder={4}
				Default={props.RawProperties.Reflectance}
				Min={0}
				Max={10}
				OnChange={(newValue: number) => props.OnSliderUpdate("Reflectance", newValue)}
			/>
			<CheckBox
				Name="Anchored"
				Default={props.RawProperties.Anchored}
				LayoutOrder={4}
				OnChange={(newValue: boolean) => props.OnCheckBoxUpdate("Anchored", newValue)}
			/>
			<CheckBox
				Name="Cast Shadow"
				Default={props.RawProperties.CastShadow}
				LayoutOrder={4}
				OnChange={(newValue: boolean) => props.OnCheckBoxUpdate("CastShadow", newValue)}
			/>
		</scrollingframe>
	);
}

export default connect(
	(state: IState) => state.PlacementSettings,
	(dispatch) => ({
		OnSliderUpdate(propertyName: "Transparency" | "Reflectance", value: number) {
			dispatch(
				updateProperty({
					propertyName,
					value,
				}),
			);
		},
		OnDropdownUpdate(propertyName: "Shape" | "Material", value: Instance | Enum.Material) {
			if (propertyName === "Material" && typeIs(value, "EnumItem")) {
				dispatch(
					updateProperty({
						propertyName,
						value,
					}),
				);
			}
		},
		OnCheckBoxUpdate(propertyName: "Anchored" | "CastShadow", value: boolean) {
			dispatch(
				updateProperty({
					propertyName,
					value,
				}),
			);
		},
		OnColorPickerUpdate(propertyName: "Color", value: Color3) {
			dispatch(
				updateProperty({
					propertyName,
					value,
				}),
			);
		},
	}),
)(GWContainer);
