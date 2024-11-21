import _ from "lodash";
import { FilterValue } from "antd/es/table/interface";

import { Sorter } from "./sorter.util";

import { TFilters } from "/imports/ui/hooks/table.hook";

/**
 * This function takes a data array and a nested string or array of strings.
 * If the nested value is an array of strings, it will loop through each string
 * and get the value from the data array. If the value is truthy, it will break
 * the loop and return the value. If the nested value is a string, it will get
 * the value from the data array directly.
 * @param data
 * @param nested
 */
function getValue(data: [], nested: string | string[]) {
  if (Array.isArray(nested)) {
    let value: string;

    for (let item of nested) {
      value = getValue(data, item);
      if (value) break;
    }

    return value;
  }

  return _.get(data, nested);
}

type TColumn = {
  dataIndex: string;
  filterBy?: {
    nested?: string | string[];
    resolver?: (value: any) => any;
  }
}

type TGetFilters = {
  text: string; 
  value: string
}


/**
 * Get filters for a given column.
 * @param column Column to be filtered.
 * @param dataSource Data to be filtered.
 * @returns An array of filters. Each filter is an object with `text` and `value` properties.
 */
export const getFilters = (column: TColumn, dataSource = []): TGetFilters[] => {
  const {
    dataIndex,
    filterBy = {}
  } = column;

  const _filter = dataSource?.map(data => {
    const { nested, resolver } = filterBy;
    const value = getValue(data, nested ?? dataIndex);

    const resolved = resolver ? resolver(value) : value;

    return { text: resolved, value: resolved };
  });

  const _sorted = [...(_filter.sort(Sorter.NESTED(['text'])))];
  const _map: readonly [unknown, unknown][] = _sorted.map(item => [item['value'], item]);
  const values: MapIterator<unknown> = new Map(_map).values();

  return Array.from(values) as TGetFilters[];
};

export const columnFilter = (filteredInfo: TFilters, dataSource = [], key: string): { 
  filters: TGetFilters[], 
  filteredValue: FilterValue, 
  onFilter: (value: string, record: Record<string, any>) => boolean 
} => {
  return {
    filters: getFilters({ dataIndex: key }, dataSource) as TGetFilters[],
    filteredValue: filteredInfo?.[key] || null,
    onFilter: (value: string, record: Record<string, any>) => record[key].includes(value as string),
  }
};