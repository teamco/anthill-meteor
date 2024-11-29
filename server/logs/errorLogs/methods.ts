import { Meteor } from "meteor/meteor";

import { TPaginateProps } from "/imports/config/types";
import { ErrorLogsCollection } from "/imports/collections/errorLogs.collection";

import './publish';

const DEFAULT_SORT: TPaginateProps['sort'] = [['metadata', 'updatedAt'], 'descend'];

Meteor.methods({

  /**
   * Fetches a range of error logs from the collection based on pagination criteria.
   * @param {Object} param - An object with three properties: current (the current page number), pageSize (the number of items per page) and sort (the sort criteria).
   * @returns {any[]} An array of ErrorLogs objects.
   */
  errorLogsPaginate: ({ current = 1, pageSize = 10, sort = DEFAULT_SORT }: TPaginateProps): any[] => {
    let [field, order] = sort;

    if (!field || field === 'metadata') field = DEFAULT_SORT[0];
    if (!order) order = DEFAULT_SORT[1];

    return ErrorLogsCollection.find({}, {
      skip: (current - 1) * pageSize,
      limit: pageSize,
      sort: [
        typeof field === "string" ? field : field.join('.'),
        order === "ascend" ? 1 : -1
      ]
    }).fetch();
  },

  /**
   * Inserts a new ErrorLog into the collection.
   * @param {Object} doc - The document to insert.
   * @returns {Promise<string>} - The _id of the new ErrorLog.
   */
  errorLogInsert: (doc: object): Promise<string> => {
    return ErrorLogsCollection.insertAsync(doc);
  },

  /**
   * Updates a ErrorLog of the collection.
   * @param {string} _id - The _id of the ErrorLog to update.
   * @param {Object} doc - The params to update.
   * @returns {Promise<string>} - The _id of the new ErrorLog.
   */
  errorLogUpdate: (_id: string, doc: object): Promise<number> => {
    return ErrorLogsCollection.updateAsync({ _id }, { $set: { ...doc } });
  },

  /**
   * Removes an ErrorLog from the collection.
   * @param {string} _id - The _id of the ErrorLog to remove.
   * @returns {Promise<number>} - The number of removed documents.
   */
  errorLogRemove: ({ _id }: { _id: string }): Promise<number> => {
    return ErrorLogsCollection.removeAsync({ _id });
  },
}); 