import { Meteor } from "meteor/meteor";
import { LayoutsCollection } from "/imports/collections/layouts.collection";
import { TPaginateProps } from "/imports/config/types";

import './publish';

const DEFAULT_SORT: TPaginateProps['sort'] = [['metadata', 'updatedAt'], 'descend'];

Meteor.methods({

  /**
   * Fetches a range of layouts from the collection based on pagination criteria.
   * @param {Object} param - An object with two properties: current (the current page number) and pageSize (the number of items per page).
   * @returns {TLayout[]} An array of Layout objects.
   */
  layoutsPaginate: ({ current = 1, pageSize = 10, sort = DEFAULT_SORT }: TPaginateProps): any[] => {
    let [field, order] = sort;

    if (!field || field === 'metadata') field = DEFAULT_SORT[0];
    if (!order) field = DEFAULT_SORT[1];

    return LayoutsCollection.find({}, {
      skip: (current - 1) * pageSize,
      limit: pageSize,
      sort: [
        typeof field === "string" ? field : field.join('.'),
        order === "ascend" ? 1 : -1
      ]
    }).fetch();
  },

  /**
   * Inserts a new Layout into the collection.
   * @param {Object} doc - The document to insert.
   * @returns {Promise<string>} - The _id of the new Layout.
   */
  layoutsInsert: (doc: object): Promise<string> => {
    return LayoutsCollection.insertAsync(doc);
  },

  /**
   * Removes an Layout from the collection.
   * @param {string} _id - The _id of the Layout to remove.
   * @returns {Promise<number>} - The number of removed documents.
   */
  layoutRemove: ({ _id }: { _id: string }): Promise<number> => {
    return LayoutsCollection.removeAsync({ _id });
  },
}); 