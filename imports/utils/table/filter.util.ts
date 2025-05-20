import _ from 'lodash';
import { FilterValue } from 'antd/es/table/interface';

import { Sorter } from './sorter.util';

import { TFilters } from '/imports/ui/hooks/table.hook';
import { Key } from 'react';

/**
 * This function takes a data array and a nested string or array of strings.
 * If the nested value is an array of strings, it will loop through each string
 * and get the value from the data array. If the value is truthy, it will break
 * the loop and return the value. If the nested value is a string, it will get
 * the value from the data array directly.
 * @param data
 * @param nested
 */
const getValue = (
  data: IDataType[] = [],
  nested: string | string[],
): string => {
  if (Array.isArray(nested)) {
    let value: string = '';

    for (let item of nested) {
      value = getValue(data, item) as string;
      if (value) break;
    }

    return value;
  }

  return _.get(data, nested);
};

type TColumn = {
  dataIndex: string;
  filterBy?: {
    nested?: string | string[];
    resolver?: (value: unknown) => unknown;
  };
};

type TGetFilters = {
  text: string;
  value: string;
};

export type TColumnFilter<T = IDataType> = {
  filters: TGetFilters[];
  filteredValue: FilterValue | null;
  onFilter: (value: boolean | Key, record: T) => boolean;
};

export type IDataType = {
  [key: string]: unknown;
};

/**
 * Get filters for a given column.
 * @param column Column to be filtered.
 * @param dataSource Data to be filtered.
 * @returns An array of filters. Each filter is an object with `text` and `value` properties.
 */
export const getFilters = (
  column: TColumn,
  dataSource: IDataType[] = [],
): TGetFilters[] => {
  const { dataIndex, filterBy = {} } = column;

  const _filter = dataSource?.map((data) => {
    const { nested, resolver } = filterBy;
    const value = getValue(data as unknown as IDataType[], nested ?? dataIndex);

    const resolved = resolver ? resolver(value) : value;

    return { text: resolved, value: resolved };
  });

  const _sorted = [..._filter.sort(Sorter.NESTED(['text']))];
  const _map: readonly [unknown, unknown][] = _sorted.map((item) => [
    item['value'],
    item,
  ]);
  const values: MapIterator<unknown> = new Map(_map).values();

  return Array.from(values) as TGetFilters[];
};

/**
 * Generates a filter configuration for a table column.
 *
 * @param {TFilters} filteredInfo - Contains the current filter information.
 * @param {TDataType[]} [dataSource=[]] - The data source for the table.
 * @param {string} key - The key used for filtering the column.
 * @returns {Object} An object containing:
 *   - `filters`: An array of filters, each with `text` and `value` properties.
 *   - `filteredValue`: The current filtered values for the column, or null if not filtered.
 *   - `onFilter`: A function that determines if a record should be included based on the filter value.
 */
export const columnFilter = <T extends IDataType>(
  filteredInfo: TFilters,
  dataSource: T[] = [],
  key: string,
): TColumnFilter<T> => {
  return {
    filters: getFilters({ dataIndex: key }, dataSource) as TGetFilters[],
    filteredValue: filteredInfo?.[key] ?? null,
    onFilter: (value: boolean | Key, record: T) => {
      const recordValue = record[key];
      if (Array.isArray(recordValue)) {
        return recordValue.includes(value);
      }
      return recordValue === value;
    },
  };
};
