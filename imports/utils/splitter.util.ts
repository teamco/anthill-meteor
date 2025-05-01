import {
  TSplitter,
  TSplitterItem,
  TSplitterLayout,
} from '/imports/config/types';

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
  layout?: TSplitterLayout,
): TSplitter => {
  let panelFound = false;

  if (!targetId || targetId.trim() === '') {
    throw new Error('Panel error: targetId must be a non-empty string');
  }

  const updatedItems: TSplitterItem[] = findPanel(
    splitter,
    targetId,
    (item: TSplitterItem) => {
      if (item) {
        panelFound = true;
        return { ...replacement, layout } as TSplitterItem;
      }

      return item;
    },
  );

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
  targetId: string,
): TSplitter => {
  const updatedItems = splitter.items
    .map((item: TSplitterItem) => {
      if (typeof item === 'object' && 'items' in item) {
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
      if (typeof item === 'object' && 'items' in item) {
        return cleanPanel(item as TSplitter);
      }

      return item;
    })
    .filter((item: TSplitterItem) => {
      if (
        typeof item === 'object' &&
        'items' in item &&
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
  callback: (item?: TSplitterItem) => TSplitterItem | null,
): (TSplitterItem | null)[] => {
  return splitter.items.map((item: TSplitterItem) => {
    if (typeof item.uuid === 'string' && item.uuid === targetId) {
      return callback(item);
    }

    if ('items' in item) {
      const updatedNestedItems = findPanel(
        item as TSplitter,
        targetId,
        callback,
      );
      return { ...item, items: updatedNestedItems };
    }

    return item;
  });
};

/**
 * Recursively searches for a node with matching items and updates their sizes.
 * @param {TSplitter} currentNode - The current splitter node to check
 * @param {TSplitterItem[]} itemsToMatch - Array of splitter items to match by UUID
 * @param {number[]} newSizes - Array of new size values to apply to matching items
 * @returns True if matching node was found and updated, false otherwise
 */
export const findAndUpdateNodeByItems = (
  currentNode: TSplitter,
  itemsToMatch: TSplitterItem[],
  newSizes: number[],
): boolean => {
  // Check if this node has items that match the ones we're looking for
  if (currentNode.items && currentNode.items.length === itemsToMatch.length) {
    // Check if the items match by comparing UUIDs
    const itemsMatch = currentNode.items.every((item, index) => {
      return itemsToMatch[index] && item.uuid === itemsToMatch[index].uuid;
    });

    if (itemsMatch) {
      // Update the sizes of the items
      currentNode.items.forEach((item, index) => {
        if (index < newSizes.length) {
          item.size = newSizes[index];
        }
      });
      return true; // Node found and updated
    }
  }

  // If not found, recursively check child nodes
  if (currentNode.items) {
    for (const item of currentNode.items) {
      if (item && typeof item === 'object' && 'items' in item) {
        if (
          findAndUpdateNodeByItems(item as TSplitter, itemsToMatch, newSizes)
        ) {
          return true; // Node found in this branch
        }
      }
    }
  }

  return false; // Node not found in this branch
};
