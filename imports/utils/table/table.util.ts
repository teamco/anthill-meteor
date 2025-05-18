import { ICommonDataType, ITableParams } from '/imports/config/types';

/**
 * Add an idx property to each item in the array and key property
 * for correct Table component rendering.
 *
 * @param {any[]} items - Array of objects
 * @param {number} current - Current page number
 * @param {number} pageSize - Page size
 * @returns {any[]} - Array of objects with idx and key properties
 */
export const indexable = (
  items: any[],
  current: number = 1,
  pageSize: number = 1,
): any[] => {
  return items.map((item: ICommonDataType, idx: number) => ({
    idx: (current === 1 ? idx : (current - 1) * pageSize + idx) + 1,
    key: item._id,
    ...item,
  }));
};

export const indexColumn: ICommonDataType = {
  key: 'idx',
  title: String.fromCharCode(8470),
  dataIndex: 'idx',
  rowScope: 'row',
  width: 70,
  align: 'center',
};

/**
 * Converts ITableParams to a query string object.
 * @param {ITableParams} params - The ITableParams object to convert.
 * @returns {Record<string, any>} - The query string object.
 */
const qsTableParams = (params: ITableParams): Record<string, any> => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});
