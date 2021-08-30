import { ReplicatedStorage } from "@rbxts/services";
import Roact from "@rbxts/roact";
import { connect } from "@rbxts/roact-rodux";
import { DragFrame, DragDropProvider } from "@rbxts/roact-dnd";
import ElementSeperator from "../misc/ElementSperator";
import Gap from "common/client/components/misc/Gap";
import Dropdown from "../GraphicalWidget/Dropdown";
import Slider from "../GraphicalWidget/Slider";
import CheckBox from "../GraphicalWidget/CheckBox";
import ColorDisplay from "../GraphicalWidget/ColorDisplay";
import Size from "../GraphicalWidget/Size";
import AddFunction from "./AddFunction";
import FunctionalityTemplate from "./FunctionalityTemplate";
import { appContext, ContextType } from "template/client/appContext";

import { updateProperty, UpdateBasePart } from "template/client/rodux/placementSettings";
import { IState } from "template/shared/Types";
import { shapes as orderedShapes } from "template/client/shapes";
import { FunctionalitiesInstancesValues } from "template/shared/Functionalities";
import Rodux from "@rbxts/rodux";
import { StoreActions } from "template/client/store";

interface BuildUIProps extends MappedProps, MappedDispatch {}

interface MappedProps {
	Functionalities: FunctionalitiesInstancesValues[];
	BuildMode: BuildMode;
	Transparency: number;
	Reflectance: number;
	Shape: BasePart;
	Material: Enum.Material;
	CastShadow: boolean;
	CanCollide: boolean;
	Color: Color3;
	Size: Vector3;
}

interface MappedDispatch {
	UpdateProperty: (
		propertyName: "Transparency" | "Reflectance" | "Material" | "CastShadow" | "CanCollide" | "Color" | "Size",
		value: number | boolean | Color3 | Enum.Material | Vector3,
	) => void;
	UpdateShape: (value: BasePart) => void;
}

const shapes = ReplicatedStorage.BlockTypes;

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

class BuildUI extends Roact.PureComponent<BuildUIProps, ContextType> {
	canvasSizeBinding: Roact.Binding<number>;
	setCanvasSizeBinding: Roact.BindingFunction<number>;

	functionalitySizeBinding: Roact.Binding<number>;
	setFunctionalitySizeBinding: Roact.BindingFunction<number>;

	bindable: BindableEvent;

	changeDropdown(newDropdown?: string) {
		this.setState((oldState) => ({
			...oldState,
			OpenDropdown: newDropdown,
		}));
	}

	constructor(props: BuildUIProps) {
		super(props);

		[this.canvasSizeBinding, this.setCanvasSizeBinding] = Roact.createBinding(0);
		[this.functionalitySizeBinding, this.setFunctionalitySizeBinding] = Roact.createBinding(0);

		this.bindable = new Instance("BindableEvent");

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
						OnDragging={() => this.bindable.Fire()}
						// AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundColor3={Color3.fromRGB(35, 35, 35)}
						Position={new UDim2(0.2, -152, 0.5, -54)}
						Size={UDim2.fromOffset(225, 300)}
						Visible={this.props.BuildMode === "Place"}
					>
						<uicorner CornerRadius={new UDim(0, 10)} />
						<frame
							BackgroundColor3={Color3.fromRGB(35, 35, 35)}
							BorderSizePixel={0}
							Size={UDim2.fromScale(1, 1)}
						>
							<uicorner CornerRadius={new UDim(0, 10)} />
							<scrollingframe
								AnchorPoint={new Vector2(0.5, 1)}
								BackgroundTransparency={1}
								BorderSizePixel={0}
								Position={UDim2.fromScale(0.5, 1)}
								Size={UDim2.fromScale(0.96, 1)}
								CanvasSize={this.canvasSizeBinding.map((value) => UDim2.fromOffset(0, value + 10))}
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
									Items={orderedShapes}
									OnChange={(newValue: BasePart) => this.props.UpdateShape(newValue)}
									GetValue={(value: keyof typeof Shapes) => shapes[value] as BasePart}
									LayoutOrder={2}
								/>
								<Dropdown
									Name="Material"
									Default={this.props.Material}
									ZIndex={11}
									Items={materials}
									OnChange={(newValue: Enum.Material) =>
										this.props.UpdateProperty("Material", newValue)
									}
									GetValue={(value: keyof Omit<typeof Enum.Material, "GetEnumItems">) =>
										Enum.Material[value]
									}
									LayoutOrder={3}
								/>
								<Size
									Default={this.props.Size}
									Name="Size"
									OnChange={(newValue) => this.props.UpdateProperty("Size", newValue)}
									LayoutOrder={4}
								/>
								<ColorDisplay
									Name="Color"
									Default={this.props.Color}
									OnChange={(newValue: Color3) => this.props.UpdateProperty("Color", newValue)}
									SizeYOffset={25}
									Bindable={this.bindable}
									LayoutOrder={5}
								/>
								<Slider
									Name="Transparency"
									Default={this.props.Transparency}
									Min={0}
									Max={1}
									OnChange={(newValue: number) => this.props.UpdateProperty("Transparency", newValue)}
									SizeYOffset={55}
									LayoutOrder={6}
									DeciminalPlace={2}
								/>
								<Slider
									Name="Reflectance"
									Default={this.props.Reflectance}
									Min={0}
									Max={1}
									OnChange={(newValue: number) => this.props.UpdateProperty("Reflectance", newValue)}
									SizeYOffset={55}
									LayoutOrder={7}
								/>
								<CheckBox
									Name="Cast Shadow"
									Default={this.props.CastShadow}
									OnChange={(newValue: boolean) => this.props.UpdateProperty("CastShadow", newValue)}
									SizeYOffset={25}
									LayoutOrder={8}
								/>
								<CheckBox
									Name="Can Collide"
									Default={this.props.CanCollide}
									OnChange={(newValue: boolean) => this.props.UpdateProperty("CanCollide", newValue)}
									SizeYOffset={25}
									LayoutOrder={9}
								/>
								<AddFunction LayoutOrder={10} />
								<frame
									BackgroundTransparency={1}
									Size={this.functionalitySizeBinding.map((value) => new UDim2(1, 0, 0, value))}
									LayoutOrder={11}
								>
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
										Change={{
											AbsoluteContentSize: (e) =>
												this.setFunctionalitySizeBinding(e.AbsoluteContentSize.Y),
										}}
									/>
								</frame>
								<uilistlayout
									HorizontalAlignment={Enum.HorizontalAlignment.Center}
									Padding={new UDim(0, 3)}
									SortOrder={Enum.SortOrder.LayoutOrder}
									Change={{
										AbsoluteContentSize: (e) => this.setCanvasSizeBinding(e.AbsoluteContentSize.Y),
									}}
								/>
							</scrollingframe>
						</frame>
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
}

const mapStateToProps = ({ PlacementSettings }: IState): MappedProps => {
	return {
		BuildMode: PlacementSettings.BuildMode,
		CanCollide: PlacementSettings.RawProperties.CanCollide,
		CastShadow: PlacementSettings.RawProperties.CastShadow,
		Color: PlacementSettings.RawProperties.Color,
		Functionalities: PlacementSettings.Functionalities,
		Material: PlacementSettings.RawProperties.Material,
		Reflectance: PlacementSettings.RawProperties.Reflectance,
		Shape: PlacementSettings.Shape,
		Size: PlacementSettings.RawProperties.Size,
		Transparency: PlacementSettings.RawProperties.Transparency,
	};
};

const mapDispatchToProps = (dispatch: Rodux.Dispatch<StoreActions>): MappedDispatch => {
	return {
		UpdateProperty: (propertyName, value) => {
			dispatch(
				updateProperty([
					{
						propertyName,
						value,
					},
				]),
			);
		},
		UpdateShape: (value) => {
			dispatch(UpdateBasePart(value));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildUI);
