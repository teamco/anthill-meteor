import { useEffect, useState } from 'react';
import { TableProps } from 'antd';
import { useSearch, useRouter } from '@tanstack/react-router';
import { useTracker } from 'meteor/react-meteor-data';

import { ITableParams } from '/imports/config/types';

type TOnChange = NonNullable<TableProps<any>['onChange']>;
export type TFilters = Parameters<TOnChange>[1];
export type TSorts = Parameters<TOnChange>[2];

type TDefaults = {
  current: number;
  pageSize: number;
};

export type TUseTable = {
  total: number;
  entities: any[];
  tableParams: ITableParams;
  filteredInfo: TFilters;
  sortedInfo: TSorts;
  handleRefresh: () => void;
  handleTableChange: TOnChange;
};

/**
 * @description Hook for fetching data for a table. It fetches data by calling a server-side method (first argument).
 * @param {string} method Server-side method name.
 * @param Collection MongoDB collection instance.
 * @param {TDefaults} [defaults] Default values for current and pageSize.
 * @returns {TUseTable} Object with `entity`, `tableParams`, `handleRefresh` and `handleTableChange` properties.
 * @example const { entity, tableParams, handleTableChange } = useTable('method.name', 100, { current: 1, pageSize: 10 });
 */
export const useTable = (
  method: string,
  getter: (
    method: string,
    setEntities: (entities: any[]) => void,
    params: {
      current: number;
      pageSize: number;
      sort: [string | undefined, string | undefined];
    },
  ) => void,
  Collection: Mongo.Collection<Document, Document>,
  defaults?: TDefaults,
): TUseTable => {
  const DEFAULT_PAGE_CURRENT = defaults?.current || 1;
  const DEFAULT_PAGE_SIZE = defaults?.pageSize || 10;

  const searchParams = useSearch({ strict: false });
  const router = useRouter();

  const [entities, setEntities] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState<TFilters>({});
  const [sortedInfo, setSortedInfo] = useState<TSorts>({});

  const tableParams = {
    pagination: {
      current: Number(searchParams.p?.split(':')?.[0]) || DEFAULT_PAGE_CURRENT,
      pageSize: Number(searchParams.p?.split(':')?.[1]) || DEFAULT_PAGE_SIZE,
    },
    sortField: searchParams.s?.split(':')[0] || undefined,
    sortOrder: searchParams.s?.split(':')[1] || undefined,
    filters: searchParams.f
      ? Object.fromEntries(
          searchParams.f
            .split('|')
            .map((f: string) => f.split(':').map((v) => v.split(','))),
        )
      : {},
  };

  const total = useTracker(() => Collection.find({}).count(), []);

  /**
   * Fetches data from the server by calling the `method` method and sets the `entities` state.
   * @returns {void}
   */
  const handleRefresh = (): void => {
    getter(method, setEntities, {
      current: tableParams.pagination?.current,
      pageSize: tableParams.pagination?.pageSize,
      sort: [tableParams.sortField, tableParams.sortOrder],
    });
  };

  /**
   * Table change handler.
   * @param pagination New pagination object.
   * @param filters New filters object.
   * @param {Record<string, any>} sorter New sorter object.
   * @description
   * Sets the search params and the table params. If the `pageSize` changed, it clears the `entity` state.
   */
  const handleTableChange: TOnChange = (
    pagination,
    filters,
    sorter: Record<string, any>,
  ) => {
    router.navigate({
      // @ts-ignore
      search: (prev: Record<string, string | null>) => ({
        ...prev,
        p: `${pagination.current}:${pagination.pageSize}`,
        s: sorter.field ? `${sorter.field}:${sorter.order}` : null,
        f: filters
          ? Object.entries(filters)
              .map(([key, value]) => `${key}:${value?.join(',')}`)
              .join('|')
          : null,
      }),
    });

    setFilteredInfo(filters);
    setSortedInfo({
      order: sorter.order,
      columnKey: sorter.field,
    });

    setEntities([]);
  };

  useEffect(handleRefresh, [searchParams]);

  return {
    total,
    entities,
    tableParams,
    filteredInfo,
    sortedInfo,
    handleRefresh,
    handleTableChange,
  };
};
