import { useEffect, useState } from "react";
import { TableProps } from "antd";
import { SortOrder, TableCurrentDataSource } from "antd/es/table/interface";
import { useSearchParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

import { ITableParams } from "/imports/config/types";

import { getEnvironments } from "/imports/ui/services/environment.service";

type TOnChange = NonNullable<TableProps<any>['onChange']>;
export type TFilters = Parameters<TOnChange>[1];

type TGetSingle<T> = T extends (infer U)[] ? U : never;
export type TSorts = TGetSingle<Parameters<TOnChange>[2]>;

type TDefaults = {
	current: number;
	pageSize: number;
}

type TUseTable = {
	total: number;
	entities: any[];
	tableParams: ITableParams;
	filteredInfo: TFilters;
	sortedInfo: TSorts;
	handleRefresh: () => void;
	handleTableChange: TOnChange;
}

type TAction = "paginate" | "sort" | "filter";

/**
 * @description Hook for fetching data for a table. It fetches data by calling a server-side method (first argument).
 * @param {string} method Server-side method name.
 * @param {Mongo.Collection<Document, Document>} Collection MongoDB collection instance.
 * @param {TDefaults} [defaults] Default values for current and pageSize.
 * @returns {TUseTable} Object with `entity`, `tableParams`, `handleRefresh` and `handleTableChange` properties.
 * @example const { entity, tableParams, handleTableChange } = useTable('method.name', 100, { current: 1, pageSize: 10 });
 */
export const useTable = (method: string, Collection: Mongo.Collection<Document, Document>, defaults?: TDefaults): TUseTable => {
	const DEFAULT_PAGE_CURRENT = defaults?.current || 1;
	const DEFAULT_PAGE_SIZE = defaults?.pageSize || 10;

	const [searchParams, setSearchParams] = useSearchParams();

	const [entities, setEntities] = useState([]);
	const [filteredInfo, setFilteredInfo] = useState<TFilters>({});
	const [sortedInfo, setSortedInfo] = useState<TSorts>({});

	const pageParams = searchParams.get("p")?.split(":") || [];
	const sortParams = searchParams.get("s")?.split(":") || [];
	const filterParams = searchParams.get("f");

	const _tParams: ITableParams = {
		pagination: {
			current: Number(pageParams[0]) || DEFAULT_PAGE_CURRENT,
			pageSize: Number(pageParams[1]) || DEFAULT_PAGE_SIZE
		}
	}

	if (sortParams?.length) {
		_tParams.sortField = sortParams[0].split('.');
		_tParams.sortOrder = sortParams[1] as SortOrder;
	}

	if (filterParams?.length) {
		_tParams.filters = {};
		const filters = filterParams.split("|");

		for (let filter of filters) {
			const _split = filter.split(":");
			const key = _split[0];
			const value = _split[1].split(',');
			_tParams.filters[key] = value;
		}
	}

	const [tableParams, setTableParams] = useState<ITableParams>(_tParams);

	const total = useTracker(() => Collection.find({}).count());

	/**
	 * Fetches data from the server by calling the `method` method and sets the `entities` state.
	 * @returns {void}
	 */
	const handleRefresh = (): void => {
		getEnvironments(method, setEntities, {
			current: tableParams.pagination?.current,
			pageSize: tableParams.pagination?.pageSize,
			sort: [tableParams.sortField, tableParams.sortOrder]
		});
		// Meteor.callAsync(method, {
		// 	current: tableParams.pagination?.current,
		// 	pageSize: tableParams.pagination?.pageSize,
		// 	sort: [tableParams.sortField, tableParams.sortOrder]
		// }).then((res: any[]) => {
		// 	setEntities(res);
		// }).catch((e) => catchErrorMsg(e, () => setEntities([])));
	};

	/**
	 * Handles the change event after data is fetched or updated.
	 * Determines the action type for table change and invokes handleTableChange with updated table parameters.
	 * @param {any[]} res - The result set returned from the server.
	 */
	const onAfterChange = (res: any[]): void => {
		let action: TAction = "paginate";

		// TODO (teamco): Check if this is needed.
		// if (tableParams.sortField && tableParams.sortOrder) {
		// 	action = "sort";
		// }

		handleTableChange(tableParams.pagination, tableParams.filters, { field: tableParams.sortField, order: tableParams.sortOrder }, { action, currentDataSource: res });
	};

	/**
	 * Table change handler.
	 * @param pagination New pagination object.
	 * @param filters New filters object.
	 * @param {Record<string, any>} sorter New sorter object.
	 * @param {TableCurrentDataSource<any>} extra New extra object.
	 * @description
	 * Sets the search params and the table params. If the `pageSize` changed, it clears the `entity` state.
	 */
	const handleTableChange: TOnChange = (pagination, filters, sorter: Record<string, any>, extra: TableCurrentDataSource<any>): void => {
		searchParams.set('p', `${pagination?.current}:${pagination?.pageSize}`);

		if (sorter?.field) {
			const _field = typeof sorter.field === "string" ? sorter.field : sorter.field?.join('.')
			searchParams.set('s', `${_field}:${sorter.order}`);
		} else {
			searchParams.delete('s');
		}

		if (filters) {
			const notNulls = Object.entries(filters).filter(f => f[1]?.length);
			const qs = notNulls.map((f) => `${f[0]}:${f[1].join(',')}`);
			qs?.length ?
				searchParams.set('f', qs.join('|')) :
				searchParams.delete('f');
		} else {
			searchParams.delete('f');
		}

		setSearchParams(searchParams);
		setFilteredInfo(filters);
		setSortedInfo({
			order: sorter.order,
			columnKey: sorter.field,
		} as TSorts);

		setTableParams({
			...tableParams,
			pagination: {
				...pagination,
				total
			},
			filters,
			sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
			sortField: Array.isArray(sorter) ? undefined : sorter.field
		});

		// `dataSource` is useless since `pageSize` changed
		if (pagination.pageSize !== tableParams.pagination?.pageSize) {
			setEntities([]);
		}
	};

	useEffect(handleRefresh, [
		tableParams.pagination?.current,
		tableParams.pagination?.pageSize,
		tableParams?.sortOrder,
		tableParams?.sortField,
		JSON.stringify(tableParams.filters),
	]);

	useEffect(() => {
		onAfterChange(entities);
	}, [entities, total]);

	return {
		total,
		entities,
		tableParams,
		filteredInfo,
		sortedInfo,
		handleRefresh,
		handleTableChange
	}
};