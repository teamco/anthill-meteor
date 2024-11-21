import { Modal } from "antd";
import { CommonDataType, ITableParams } from "../config/types";

/**
 * Add an idx property to each item in the array and key property
 * for correct Table component rendering.
 *
 * @param {any[]} items - Array of objects
 * @param {number} current - Current page number
 * @param {number} pageSize - Page size
 * @returns {any[]} - Array of objects with idx and key properties
 */
export const indexable = (items: any[], current: number = 1, pageSize: number = 1): any[] => {
  return items.map((item: CommonDataType, idx: number) => ({
    idx: (current === 1 ? idx : (current - 1) * pageSize + idx) + 1,
    key: item._id,
    ...item
  }));
};

export const indexColumn: any = {
  title: String.fromCharCode(8470),
  dataIndex: 'idx',
  rowScope: 'row',
};

const qsTableParams = (params: ITableParams) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

/**
 * Closes all modals when called.
 * @returns {void}
 */
export const onModalCancel = (): void => {
  Modal.destroyAll();
}