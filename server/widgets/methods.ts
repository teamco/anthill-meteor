import { Meteor } from "meteor/meteor";

import { WidgetsCollection } from "/imports/collections/widgets.collection";
import { TPaginateProps } from "/imports/config/types";

import './publish';

const DEFAULT_SORT: TPaginateProps['sort'] = [['metadata', 'updatedAt'], 'descend'];

Meteor.methods({

  /**
   * Fetches a range of widgets from the collection based on pagination criteria.
   * @param {Object} param - An object with three properties: current (the current page number), pageSize (the number of items per page) and sort (the sort criteria).
   * @returns {any[]} An array of Widget objects.
   */
  widgetsPaginate: ({ current = 1, pageSize = 10, sort = DEFAULT_SORT }: TPaginateProps): any[] => {
    let [field, order] = sort;

    if (!field || field === 'metadata') field = DEFAULT_SORT[0];
    if (!order) field = DEFAULT_SORT[1];

    return WidgetsCollection.find({}, {
      skip: (current - 1) * pageSize,
      limit: pageSize,
      sort: [
        typeof field === "string" ? field : field.join('.'),
        order === "ascend" ? 1 : -1
      ]
    }).fetch();
  },

  /**
   * Inserts a new Widget into the collection.
   * @param {Object} doc - The document to insert.
   * @returns {Promise<string>} - The _id of the new Widget.
   */
  widgetInsert: (doc: object): Promise<string> => {
    return WidgetsCollection.insertAsync(doc);
  },

  /**
   * Updates a Widget of the collection.
   * @param {string} _id - The _id of the Widget to update.
   * @param {Object} doc - The params to update.
   * @returns {Promise<string>} - The _id of the new Widget.
   */
  widgetUpdate: (_id: string, doc: object): Promise<number> => {
    return WidgetsCollection.updateAsync({ _id }, { $set: { ...doc } });
  },

  /**
   * Removes an Widget from the collection.
   * @param {string} _id - The _id of the Widget to remove.
   * @returns {Promise<number>} - The number of removed documents.
   */
  widgetRemove: ({ _id }: { _id: string }): Promise<number> => {
    return WidgetsCollection.removeAsync({ _id });
  },
}); 