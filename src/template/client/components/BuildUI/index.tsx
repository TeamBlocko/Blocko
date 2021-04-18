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
import FunctionalityTemplate from "./FunctionalityTemplate";
import { appContext, ContextType } from "template/client/appContext";

import { updateProperty, UpdateBasePart } from "template/client/rodux/placementSettings";
import { IState, PlacementSettings } from "template/shared/Types";

interface BuildUIProps extends PlacementSettings {
	OnSliderUpdate(propertyName: string, value: number): void;
	OnDropdownUpdate(propertyName: string, value: Instance | Enum.Material): void;
	OnCheckBoxUpdate(propertyName: string, value: boolean): void;
	OnColorPickerUpdate(propertyName: string, value: Color3): void;
}

const Shapes = ReplicatedStorage.BlockTypes;

const ignoreMaterials: Enum.Material[] = [
	Enum.Material.Air,
	Enum.Material.Water,
	Enum.Material.Rock,
	Enum.Material.Asphalt,
	Enum.Material.Snow,
	Enum.Material.Glacier,
	Enum.Material.Sandstone,
	Enum.Material.Mud,
	Enum.Material.Basalt,
	Enum.Material.Ground,
	Enum.Material.CrackedLava,
	Enum.Material.Salt,
	Enum.Material.LeafyGrass,
	Enum.Material.Limestone,
	Enum.Material.Pavement,
];

const materials = Enum.Material.GetEnumItems().filter((material) => !ignoreMaterials.includes(material));

class BuildUI extends Roact.Component<BuildUIProps, ContextType> {
	uilistRef: Roact.Ref<UIListLayout>;
	functionalitiesUIlistRef: Roact.Ref<UIListLayout>;

	changeDropdown(newDropdown?: string) {
		this.setState((oldState) => ({
			...oldState,
			OpenDropdown: newDropdown,
		}));
	}

	constructor(props: BuildUIProps) {
		super(props);

		this.uilistRef = Roact.createRef();
		this.functionalitiesUIlistRef = Roact.createRef();

		this.setState({});
	}

	render() {
		return (
			<appContext.Provider
				value={{
					OpenDropdown: this.state.OpenDropdown,
					changeDropdown: (newDropdown) => this.changeDropdown(newDropdown),
				}}
			>
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
						Visible={this.props.BuildMode === "Place"}
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
								Default={this.props.Shape}
								ZIndex={12}
								Items={Shapes.GetChildren()}
								OnChange={(newValue: Instance) => this.props.OnDropdownUpdate("Shape", newValue)}
								GetValue={(value: keyof typeof Shapes) => Shapes[value] as Instance}
								LayoutOrder={2}
							/>
							<Dropdown
								Name="Material"
								Default={this.props.RawProperties.Material}
								ZIndex={11}
								Items={materials}
								OnChange={(newValue: Enum.Material) =>
									this.props.OnDropdownUpdate("Material", newValue)
								}
								GetValue={(value: keyof Omit<typeof Enum.Material, "GetEnumItems">) =>
									Enum.Material[value]
								}
								LayoutOrder={3}
							/>
							<ColorDisplay
								Name="Color"
								Default={this.props.RawProperties.Color}
								OnChange={(newValue: Color3) => this.props.OnColorPickerUpdate("Color", newValue)}
								SizeYOffset={25}
								LayoutOrder={4}
							/>
							<Slider
								Name="Transparency"
								Default={this.props.RawProperties.Transparency}
								Min={0}
								Max={10}
								OnChange={(newValue: number) => this.props.OnSliderUpdate("Transparency", newValue)}
								SizeYOffset={55}
								LayoutOrder={5}
							/>
							<Slider
								Name="Reflectance"
								Default={this.props.RawProperties.Reflectance}
								Min={0}
								Max={10}
								OnChange={(newValue: number) => this.props.OnSliderUpdate("Reflectance", newValue)}
								SizeYOffset={55}
								LayoutOrder={6}
							/>
							<CheckBox
								Name="Cast Shadow"
								Default={this.props.RawProperties.CastShadow}
								OnChange={(newValue: boolean) => this.props.OnCheckBoxUpdate("CastShadow", newValue)}
								SizeYOffset={25}
								LayoutOrder={7}
							/>
							<AddFunction LayoutOrder={8} />
							<frame BackgroundTransparency={1} Size={UDim2.fromScale(1, 0)} LayoutOrder={9}>
								{this.props.Functionalities.map((functionality, index) => (
									<FunctionalityTemplate
										Functionality={functionality}
										LayoutOrder={index}
										ZIndex={this.props.Functionalities.size() - index}
									/>
								))}
								<uilistlayout
									HorizontalAlignment={Enum.HorizontalAlignment.Center}
									SortOrder={Enum.SortOrder.LayoutOrder}
									Padding={new UDim(0, 3)}
									Ref={this.functionalitiesUIlistRef}
								/>
							</frame>
							<uilistlayout
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
								Padding={new UDim(0, 3)}
								SortOrder={Enum.SortOrder.LayoutOrder}
								Ref={this.uilistRef}
							/>
						</scrollingframe>
						<imagelabel
							AnchorPoint={new Vector2(0.5, 0.5)}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={new UDim2(1, 50, 1, 50)}
							ZIndex={0}
							Image={"rbxassetid://6513986549"}
							ImageColor3={new Color3()}
							ImageTransparency={0.5}
						/>
					</DragFrame>
				</DragDropProvider>
			</appContext.Provider>
		);
	}

	didMount() {
		const uilist = this.uilistRef.getValue();
		if (!uilist) return;

		const mainFrame = uilist.Parent as ScrollingFrame;
		mainFrame.CanvasSize = new UDim2(0, 0, 0, math.max(300, uilist.AbsoluteContentSize.Y + 10));
		uilist.GetPropertyChangedSignal("AbsoluteContentSize").Connect(() => {
			mainFrame.CanvasSize = new UDim2(0, 0, 0, math.max(300, uilist.AbsoluteContentSize.Y + 10));
		});
	}

	didUpdate() {
		const functionalitiesUIlist = this.functionalitiesUIlistRef.getValue();
		if (!functionalitiesUIlist) return;

		const functionalityContainer = functionalitiesUIlist.Parent as Frame;
		functionalityContainer.Size = new UDim2(1, 0, 0, functionalitiesUIlist.AbsoluteContentSize.Y);
	}
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
				dispatch(UpdateBasePart(value));
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
