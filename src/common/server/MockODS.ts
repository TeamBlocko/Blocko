export default {
	SetAsync(this: OrderedDataStore, key: string, value?: unknown) {},
	GetAsync(this: OrderedDataStore, key: string) {},
	GetSortedAsync(
		this: OrderedDataStore,
		ascending: boolean,
		pagesize: number,
		minValue?: number,
		maxValue?: number,
	): DataStorePages {
		return {
			GetCurrentPage() {
				return [];
			},
		} as unknown as DataStorePages;
	},
} as OrderedDataStore;
