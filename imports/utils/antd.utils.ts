import { CommonDataType } from "../config/types";

/**
 * Add an idx property to each item in the array and key property
 * for correct Table component rendering.
 *
 * @param {any[]} items - Array of objects
 * @returns {any[]} - Array of objects with idx and key properties
 */
export const indexable = (items: any[]): any[] => {
  return items.map((item: CommonDataType, idx: number) => ({
    idx: idx + 1,
    key: item._id,
    ...item
  }));
};

export const indexColumn: any = {
  title: String.fromCharCode(8470),
  dataIndex: 'idx',
  rowScope: 'row',
};