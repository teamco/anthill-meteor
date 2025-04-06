import { Modal } from "antd";
import {
  ICommonDataType,
  ITableParams,
  TSplitter,
  TSplitterItem,
  TSplitterLayout,
} from "/imports/config/types";

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
  pageSize: number = 1
): any[] => {
  return items.map((item: ICommonDataType, idx: number) => ({
    idx: (current === 1 ? idx : (current - 1) * pageSize + idx) + 1,
    key: item._id,
    ...item,
  }));
};

export const indexColumn: ICommonDataType = {
  key: "idx",
  title: String.fromCharCode(8470),
  dataIndex: "idx",
  rowScope: "row",
  width: 70,
  align: "center",
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

/**
 * Closes all modals when called.
 * @returns {void}
 */
export const onModalCancel = (): void => {
  Modal.destroyAll();
};

/**
 * Recursively searches for the panel with the given uuid in the given Splitter
 * and replaces it with the given replacement panel.
 *
 * @param {TSplitter} splitter - The Splitter component to search in.
 * @param {string} targetId - The uuid of the panel to replace.
 * @param {TSplitter} replacement - The new panel to replace the old one.
 * @param {TSplitterLayout} [layout] - The layout of the new panel. If not given, the layout of the old panel is used.
 * @returns {TSplitter} - The updated Splitter component.
 */
export const replacePanel = (
  splitter: TSplitter,
  targetId: string,
  replacement: TSplitter,
  layout?: TSplitterLayout
): TSplitter => {
  let panelFound = false;
  
  if (!targetId || targetId.trim() === '') {
    throw new Error('Panel error: targetId must be a non-empty string');
  }

  const updatedItems: TSplitterItem[] = findPanel(splitter, targetId, (item: TSplitterItem) => {
    if (item) {
      panelFound = true;
      return { ...replacement, layout } as TSplitterItem;
    }

    return item;
  });

  if (!panelFound) {
    console.warn(`Panel with targetId '${targetId}' not found.`);
  }

  return { ...splitter, items: updatedItems as TSplitterItem[] };
};

/**
 * Recursively searches for the panel with the given uuid in the given Splitter
 * and deletes it.
 *
 * @param {TSplitter} splitter - The Splitter component to search in.
 * @param {string} targetId - The uuid of the panel to delete.
 * @returns {TSplitter} - The updated Splitter component.
 */
export const deletePanel = (
  splitter: TSplitter,
  targetId: string
): TSplitter => {
  const updatedItems = splitter.items
    .map((item: TSplitterItem) => {
      if (typeof item === "object" && "items" in item) {
        return deletePanel(item as TSplitter, targetId);
      }

      if (item.uuid === targetId) {
        return null;
      }

      return item;
    })
    .filter((item: TSplitterItem) => item !== null);

  return { ...splitter, items: updatedItems as TSplitterItem[] };
};

/**
 * Recursively searches for empty panels in the given Splitter
 * and removes them.
 *
 * @param {TSplitter} splitter - The Splitter component to search in.
 * @returns {TSplitter} - The updated Splitter component.
 */
export const cleanPanel = (splitter: TSplitter): TSplitter => {
  const updatedItems = splitter.items
    .map((item: TSplitterItem) => {
      if (typeof item === "object" && "items" in item) {
        return cleanPanel(item as TSplitter);
      }

      return item;
    })
    .filter((item: TSplitterItem) => {
      if (
        typeof item === "object" &&
        "items" in item &&
        Array.isArray(item.items)
      ) {
        return item.items.length > 0;
      }

      return true;
    });

  return { ...splitter, items: updatedItems as TSplitterItem[] };
};

/**
 * Recursively searches for the panel with the given uuid in the given Splitter
 * and applies the given callback to it.
 *
 * @param {TSplitter} splitter - The Splitter component to search in.
 * @param {string} targetId - The uuid of the panel to replace.
 * @param {(item?: TSplitterItem) => TSplitterItem | null} callback - A callback function that takes the found panel or undefined
 * as argument and returns the new panel or null if the panel should be deleted.
 * @returns {(TSplitterItem | null)[]} - The updated Splitter component.
 */
export const findPanel = (
  splitter: TSplitter,
  targetId: string,
  callback: (item?: TSplitterItem) => TSplitterItem | null
): (TSplitterItem | null)[] => {
  return splitter.items.map((item: TSplitterItem) => {
    if (typeof item.uuid === "string" && item.uuid === targetId) {
      return callback(item);
    }

    if ("items" in item) {
      const updatedNestedItems = findPanel(
        item as TSplitter,
        targetId,
        callback
      );
      return { ...item, items: updatedNestedItems };
    }

    return item;
  });
};
