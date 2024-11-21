import { useEffect, useState } from "react";
import { TableProps } from "antd";
import { useSearchParams } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";

import { ITableParams } from "/imports/config/types";

import { catchErrorMsg } from "/imports/utils/message.util";
import { SorterResult } from "antd/es/table/interface";

type TDefaults = {
	current: number;
	pageSize: number;
}

type TUseTable = {
	total: number;
	entities: any[];
	tableParams: ITableParams;
	handleRefresh: () => void;
	handleTableChange: TableProps<any>['onChange'];
}

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

	const pageParams = searchParams.get("p")?.split(".") || [];

	const [tableParams, setTableParams] = useState<ITableParams>({
		pagination: {
			current: Number(pageParams[0]) || DEFAULT_PAGE_CURRENT,
			pageSize: Number(pageParams[1]) || DEFAULT_PAGE_SIZE
		},
	});

	const total = useTracker(() => Collection.find({}).count());

	/**
	 * Fetches data from the server by calling the `method` method and sets the `entities` state.
	 * @returns {void}
	 */
	const handleRefresh = (): void => {
		Meteor.callAsync(method, {
			current: tableParams.pagination?.current,
			pageSize: tableParams.pagination?.pageSize
		}).then((res: any[]) => {
			setEntities(res);
		}).catch((e) => catchErrorMsg(e, () => setEntities([])))
	};

	/**
	 * Table change handler.
	 * @param pagination New pagination object.
	 * @param filters New filters object.
	 * @param {SorterResult<any>} sorter New sorter object.
	 * @description
	 * Sets the search params and the table params. If the `pageSize` changed, it clears the `entity` state.
	 */
	const handleTableChange: TableProps<any>['onChange'] = (pagination, filters, sorter: SorterResult<any>): void => {
		const searchParams: { p?: string; s?: string } = {
			p: `${pagination?.current}.${pagination?.pageSize}`,
		}

		if (sorter?.field) {
			searchParams.s = `${sorter.field}.${sorter.order}`
		}

		setSearchParams(searchParams);

		setTableParams({
			pagination,
			filters,
			sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
			sortField: Array.isArray(sorter) ? undefined : sorter.field,
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
		setTableParams({
			...tableParams,
			pagination: {
				...tableParams.pagination,
				total
			},
		});
	}, [entities, total]);

	return {
		total,
		entities,
		tableParams,
		handleRefresh,
		handleTableChange
	}
};