import { Modal } from "antd";

import { CommonDataType, ITableParams, TSplitter, TSplitterItem, TSplitterLayout } from "/imports/config/types";

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

export const indexColumn: CommonDataType = {
  key: 'idx',
  title: String.fromCharCode(8470),
  dataIndex: 'idx',
  rowScope: 'row',
  width: 70,
  align: 'center',
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

export const replacePanel = (panel: TSplitter, targetUUID: string, replacement: TSplitter, layout?: TSplitterLayout) => {
  const updatedItems= panel?.items?.map((item: TSplitterItem) => {
    if (typeof item?.uuid === 'string') {
      if (item.uuid === targetUUID) {
        if (layout) {
          return { ...replacement, layout };
        }

        return { uuid: replacement, layout }
      }

      return item;

    } else {

      // @ts-ignore
      return replaceUUIDWithPanel(item, targetUUID, replacement, layout);
    }
  });

  return { ...panel, items: updatedItems };
};
