import _ from 'lodash';
import dayjs from 'dayjs';

import { TSorts } from '/imports/ui/hooks/table.hook';

/**
 * @param {string} dateA - a date, represented in string format
 * @param {string} dateB - a date, represented in string format
 */
const dateSort = (dateA: string, dateB: string) =>
  dayjs(dateA).diff(dayjs(dateB));

/**
 * @param {number|string} a
 * @param {number|string} b
 */
const defaultSort = (a: number | string, b: number | string): number => {
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
};

/**
 * @constant findInPath
 * @param pathArray
 * @param a
 * @return {*}
 */
const findInPath = (pathArray: string[] = [], a: any): any => {
  let _a: any;
  for (let path of pathArray) {
    _a = _.get(a, path);
    if (_a) break;
  }

  return _a;
};

/**
 * @param {Array} paths
 * @param {string} type
 * @return {*}
 */
const nestedSort = (paths: string[], type: string = 'default'): any => {
  let pathArray: string[] = paths;

  return (a: any, b: any) => {
    const _a = findInPath(pathArray, a);
    const _b = findInPath(pathArray, b);

    if (type === 'date') return dateSort(_a, _b);

    return defaultSort(_a, _b);
  };
};

export const Sorter = {
  DEFAULT: defaultSort,
  NESTED: nestedSort,
  DATE: dateSort,
};

/**
 * Creates a sorter configuration for a table column.
 *
 * @param {TSorts} sortedInfo - Contains the current sorting information, including the column key and order.
 * @param {string} sorterKey - The key used for sorting the column.
 * @param {string} [orderKey] - Optional key used to determine the sort order; defaults to `sorterKey` if not provided.
 * @returns { sorter: any; sortOrder: any } An object containing the sorter function and sortOrder for the column.
 */
export const columnSorter = (
  sortedInfo: TSorts,
  sorterKey: string,
  orderKey?: string,
): { sorter: any; sortOrder: any } => {
  if (!orderKey) orderKey = sorterKey;
  return {
    sorter: Sorter.NESTED([sorterKey]),
    sortOrder: sortedInfo.columnKey === orderKey ? sortedInfo.order : null,
  };
};
