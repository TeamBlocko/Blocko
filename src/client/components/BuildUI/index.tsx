import { ReplicatedStorage } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { DragFrame, DragDropProvider } from "@rbxts/roact-dnd";
import ElementSeperator from "../misc/ElementSperator";
import Gap from "../misc/Gap";
import Dropdown from "../GraphicalWidget/Dropdown";
import Slider from "../GraphicalWidget/Slider";
import CheckBox from "../GraphicalWidget/CheckBox";
import ColorDisplay from "../GraphicalWidget/ColorDisplay";
import AddFunction from "./AddFunction";
import FunctionalityTemplate from "./FunctionalityTemplate"

import { updateProperty, updateSetting } from "client/rodux/placementSettings";
import { IState, PlacementSettings } from "shared/Types";

interface BuildUIPros extends PlacementSettings {
	OnSliderUpdate(propertyName: string, value: number): void;
	OnDropdownUpdate(propertyName: string, value: Instance | Enum.Material): void;
	OnCheckBoxUpdate(propertyName: string, value: boolean): void;
	OnColorPickerUpdate(propertyName: string, value: Color3): void;
}

const Shapes = ReplicatedStorage.BlockTypes;

function BuildUI(props: BuildUIPros) {
	return (
		<DragDropProvider>
			<DragFrame
				DropId="BuildUI"
				DropResetsPosition={false}
				TargetData=""
				// AnchorPoint={new Vector2(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(35, 35, 35)}
				BackgroundTransparency={0}
				Position={UDim2.fromScale(0.2, 0.5)}
				Size={UDim2.fromOffset(225, 300)}
				Visible={props.BuildMode === "Place"}
			>
				<uicorner CornerRadius={new UDim(0, 10)} />
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
							<Gap Length={5} LayoutOrder={0} />
							<ElementSeperator LayoutOrder={1} />
							<Dropdown
								Name="Shape"
								Default={props.Shape}
								ZIndex={12}
								Items={Shapes.GetChildren()}
								OnChange={(newValue: Instance) => props.OnDropdownUpdate("Shape", newValue)}
								GetValue={(value: keyof typeof Shapes) => Shapes[value] as Instance}
								LayoutOrder={2}
							/>
							<Dropdown
								Name="Material"
								Default={props.RawProperties.Material}
								ZIndex={11}
								Items={Enum.Material.GetEnumItems()}
								OnChange={(newValue: Enum.Material) => props.OnDropdownUpdate("Material", newValue)}
								GetValue={(value: keyof Omit<typeof Enum.Material, "GetEnumItems">) => Enum.Material[value]}
								LayoutOrder={3}
							/>
							<ColorDisplay
								Name="Color"
								Default={props.RawProperties.Color}
								OnChange={(newValue: Color3) => props.OnColorPickerUpdate("Color", newValue)}
								SizeYOffset={25}
								LayoutOrder={4}
							/>
							<Slider
								Name="Transparency"
								Default={props.RawProperties.Transparency}
								Min={0}
								Max={10}
								OnChange={(newValue: number) => props.OnSliderUpdate("Transparency", newValue)}
								SizeYOffset={55}
								LayoutOrder={5}
							/>
							<Slider
								Name="Reflectance"
								Default={props.RawProperties.Reflectance}
								Min={0}
								Max={10}
								OnChange={(newValue: number) => props.OnSliderUpdate("Reflectance", newValue)}
								SizeYOffset={55}
								LayoutOrder={6}
							/>
							<CheckBox
								Name="Cast Shadow"
								Default={props.RawProperties.CastShadow}
								OnChange={(newValue: boolean) => props.OnCheckBoxUpdate("CastShadow", newValue)}
								SizeYOffset={25}
								LayoutOrder={7}
							/>
							<AddFunction LayoutOrder={8} />
							<frame
								BackgroundTransparency={1}
								Size={UDim2.fromScale(1, 0)}
								LayoutOrder={9}
							>
								{
									props.Functionalities.map((functionality, index) => (
										<FunctionalityTemplate
											Functionality={functionality}
											LayoutOrder={index}
										/>)
									)
								}
								<uilistlayout
									HorizontalAlignment={Enum.HorizontalAlignment.Center}
									SortOrder={Enum.SortOrder.LayoutOrder}
									Padding={new UDim(0, 3)}
									Ref={(e) => {
										if (!e) return
										const parent = e.Parent as Frame
										parent.Size = new UDim2(1, 0, 0, e.AbsoluteContentSize.Y) 
									}}
								/>
							</frame>
							<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Center} Padding={new UDim(0, 3)} SortOrder={Enum.SortOrder.LayoutOrder} />
						</scrollingframe>
			</DragFrame>
		</DragDropProvider>
	);
}

export default connect(
	(state: IState) => state.PlacementSettings,
	(dispatch) => ({
		OnSliderUpdate(propertyName: "Transparency" | "Reflectance", value: number) {
			dispatch(
				updateProperty([
					{
						propertyName,
						value,
					},
				]),
			);
		},
		OnDropdownUpdate(propertyName: "Shape" | "Material", value: Instance | Enum.Material) {
			if (propertyName === "Material" && typeIs(value, "EnumItem")) {
				dispatch(
					updateProperty([
						{
							propertyName,
							value,
						},
					]),
				);
			} else if (propertyName === "Shape" && typeIs(value, "Instance") && value.IsA("BasePart")) {
				dispatch(
					updateSetting({
						settingName: propertyName,
						value,
					}),
				);
			}
		},
		OnCheckBoxUpdate(propertyName: "CastShadow", value: boolean) {
			dispatch(
				updateProperty([
					{
						propertyName,
						value,
					},
				]),
			);
		},
		OnColorPickerUpdate(propertyName: "Color", value: Color3) {
			dispatch(
				updateProperty([
					{
						propertyName,
						value,
					},
				]),
			);
		},
	}),
)(BuildUI);
