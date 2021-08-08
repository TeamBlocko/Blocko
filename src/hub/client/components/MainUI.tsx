import Roact from "@rbxts/roact";
import NavBar from "./NavBar";
import WorldsMenu from "./WorldsMenu";
import { searchContext, SearchContext, filters, FilterItem } from "hub/client/searchContext";
import { NotificationContainer } from "common/client/components/NotificationContainer";

class MainUI extends Roact.Component<{}, SearchContext> {
	constructor() {
		super({});

		this.setState({
			filter: filters[0],
			searchText: "",
		});
	}

	setSearchText(searchText: string) {
		this.setState((oldState) => ({
			...oldState,
			searchText,
		}));
	}

	setSearchFilter(filter: FilterItem) {
		this.setState((oldState) => ({
			...oldState,
			filter,
		}));
	}

	render() {
		return (
			<screengui ResetOnSpawn={false} ZIndexBehavior={Enum.ZIndexBehavior.Sibling} IgnoreGuiInset={true}>
				<NotificationContainer defaultNotificationWidth={0} />
				<frame BackgroundColor3={Color3.fromRGB(66, 66, 66)} Size={UDim2.fromScale(1, 1)}>
					<NavBar />
					<searchContext.Provider
						value={{
							setFilter: (filter) => this.setSearchFilter(filter),
							setSearchText: (text) => this.setSearchText(text),
							searchText: this.state.searchText,
							filter: this.state.filter,
						}}
					>
						<WorldsMenu />
					</searchContext.Provider>
				</frame>
			</screengui>
		);
	}
}

export default MainUI;
