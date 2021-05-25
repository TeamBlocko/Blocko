import Roact from "@rbxts/roact";
import Dropdown from "./Dropdown";
import { searchContext, filters } from "hub/client/searchContext";

function Search() {
	return (
		<searchContext.Consumer render={
			(value) => {
				return (
					<frame
						AnchorPoint={new Vector2(0.5, 0.5)}
						BackgroundColor3={new Color3(1, 1, 1)}
						Position={UDim2.fromScale(0.5, 0.32)}
						Selectable={true}
						Size={UDim2.fromScale(0.425, 0.075)}
						ZIndex={2}
					>
						<uicorner CornerRadius={new UDim(0.2, 0)} />
						<uiaspectratioconstraint AspectRatio={9.301} />
						<imagebutton
							AnchorPoint={new Vector2(0, 0.5)}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.035, 0.5)}
							Size={UDim2.fromScale(0.047, 0.429)}
							Image={"rbxassetid://3926305904"}
							ImageColor3={Color3.fromRGB(185, 185, 185)}
							ImageRectOffset={new Vector2(964, 324)}
							ImageRectSize={new Vector2(36, 36)}
							ScaleType={Enum.ScaleType.Fit}
						/>
						<textbox
							AnchorPoint={new Vector2(0, 0.5)}
							BackgroundTransparency={1}
							Position={UDim2.fromScale(0.1, 0.5)}
							Size={UDim2.fromScale(0.6, 0.35)}
							Font={Enum.Font.Gotham}
							PlaceholderColor3={Color3.fromRGB(185, 185, 185)}
							PlaceholderText={"Search"}
							Text={value.searchText}
							TextColor3={Color3.fromRGB(150, 150, 150)}
							TextScaled={true}
							TextSize={12}
							TextWrapped={true}
							TextXAlignment={Enum.TextXAlignment.Left}
							Change={{
								Text: (e) => value.setSearchText(e.Text)
							}}
						/>
						<frame
							AnchorPoint={new Vector2(0, 0.5)}
							BackgroundColor3={Color3.fromRGB(240, 240, 240)}
							Position={UDim2.fromScale(0.735, 0.5)}
							Size={UDim2.fromScale(0.006, 0.6)}
						>
							<uicorner CornerRadius={new UDim(1, 0)} />
						</frame>
						<Dropdown
							Items={filters}
							Default={value.filter}
							OnChange={(newValue) => value.setFilter(newValue)}
							GetValue={(value) => filters.find((filter) => filter.Name === value)!}
							Name={"Filter"}
						/>
					</frame>
				);
			}
		}/>
	);
}

export default Search;
