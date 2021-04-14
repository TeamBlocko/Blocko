import Roact from "@rbxts/roact";

function Search() {
	return (
		<frame
			BackgroundColor3={Color3.fromRGB(253, 253, 253)}
			BackgroundTransparency={0.95}
			Selectable={true}
			Active={true}
			Size={new UDim2(0.9, 0, 0, 35)}
		>
			<uicorner CornerRadius={new UDim(0, 5)} />
			<textbox
				BackgroundTransparency={1}
				Size={UDim2.fromScale(0.95, 1)}
				Font={Enum.Font.SourceSans}
				PlaceholderText="Search"
				Text=""
				TextColor3={Color3.fromRGB(254, 254, 254)}
				TextSize={22}
				TextStrokeColor3={Color3.fromRGB(253, 253, 253)}
				TextXAlignment={Enum.TextXAlignment.Left}
			/>
			<uilistlayout HorizontalAlignment={Enum.HorizontalAlignment.Right} />
		</frame>
	);
}

export default Search;
