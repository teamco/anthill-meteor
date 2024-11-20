import { useContext, useEffect, useState } from "react";
import { TableProps } from "antd";
import { useSearchParams } from "react-router-dom";

import { ITableParams } from "/imports/config/types";

import { NotificationContext } from "/imports/ui/context/notification.context";

import { catchMsg } from "/imports/utils/message.util";

type TDefaults = {
	current: number;
	pageSize: number;
}

type TUseTable = { 
	entities: any[]; 
	tableParams: ITableParams; 
	handleTableChange: TableProps<any>['onChange']; 
}

/**
 * @description
 * Hook for fetching data for a table. It fetches data by calling a server-side method (first argument).
 * @param {string} method Server-side method name.
 * @param {number} total Total number of items.
 * @param {TDefaults} [defaults] Default values for current and pageSize.
 * @returns {{ entities, tableParams, handleTableChange }} Object with `entity`, `tableParams`, and `handleTableChange` properties.
 * @example
 * const { entity, tableParams, handleTableChange } = useTable('method.name', 100, { current: 1, pageSize: 10 });
 */
export const useTable = (method: string, total: number, defaults?: TDefaults): TUseTable => {
  const DEFAULT_PAGE_CURRENT = defaults?.current || 1;
	const DEFAULT_PAGE_SIZE = defaults?.pageSize || 5;

  const { notificationApi } = useContext(NotificationContext);
  const [searchParams, setSearchParams] = useSearchParams();

	const [entities, setEntities] = useState([]);

  const [tableParams, setTableParams] = useState<ITableParams>({
		pagination: {
			current: Number(searchParams.get("c")) || DEFAULT_PAGE_CURRENT,
			pageSize: Number(searchParams.get("s")) || DEFAULT_PAGE_SIZE
		},
	});

	useEffect(() => {
		Meteor.callAsync(method, { 
			current: tableParams.pagination?.current, 
			pageSize: tableParams.pagination?.pageSize 
		}).then((res: any[]) => {
			setEntities(res);
		}).catch((e) => catchMsg(e, () => setEntities([])))
	}, [
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

	/**
	 * Table change handler.
	 * @param pagination New pagination object.
	 * @param filters New filters object.
	 * @param sorter New sorter object.
	 * @description
	 * Sets the search params and the table params. If the `pageSize` changed, it clears the `entity` state.
	 */
	const handleTableChange: TableProps<any>['onChange'] = (pagination, filters, sorter): void => {
		setSearchParams({ 
			c: pagination?.current.toString(), 
			s: pagination?.pageSize .toString()
		});

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

	return {
		entities,
		tableParams,
		handleTableChange
	}
};