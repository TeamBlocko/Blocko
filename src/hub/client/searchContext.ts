import { createContext } from "@rbxts/roact";

export interface FilterItem {
	Name: Filter;
}

export const filters: FilterItem[] = [{ Name: "Active" }, { Name: "Featured" }, { Name: "Owned" }];

export interface SearchContext {
	filter: FilterItem;
	searchText: string;
	setFilter: (filter: FilterItem) => void;
	setSearchText: (text: string) => void;
}

export const searchContext = createContext<SearchContext>({
	setFilter: (filter) => {},
	setSearchText: (text) => {},
	filter: filters[0],
	searchText: "",
});
