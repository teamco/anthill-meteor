import { Meteor } from "meteor/meteor";

import { TPaginateProps } from "/imports/config/types";
import { UserLogsCollection } from "/imports/collections/userLogs.collection";

import './publish';

const DEFAULT_SORT: TPaginateProps['sort'] = [['metadata', 'updatedAt'], 'descend'];

Meteor.methods({

  /**
   * Fetches a range of user logs from the collection based on pagination criteria.
   * @param {Object} param - An object with three properties: current (the current page number), pageSize (the number of items per page) and sort (the sort criteria).
   * @returns {any[]} An array of UserLogs objects.
   */
  userLogsPaginate: ({ current = 1, pageSize = 10, sort = DEFAULT_SORT }: TPaginateProps): any[] => {
    let [field, order] = sort;

    if (!field || field === 'metadata') field = DEFAULT_SORT[0];
    if (!order) field = DEFAULT_SORT[1];

    return UserLogsCollection.find({}, {
      skip: (current - 1) * pageSize,
      limit: pageSize,
      sort: [
        typeof field === "string" ? field : field.join('.'),
        order === "ascend" ? 1 : -1
      ]
    }).fetch();
  },

  /**
   * Inserts a new UserLog into the collection.
   * @param {Object} doc - The document to insert.
   * @returns {Promise<string>} - The _id of the new UserLog.
   */
  userLogInsert: (doc: object): Promise<string> => {
    console.debug(3,doc);
    return UserLogsCollection.insertAsync(doc);
  },

  /**
   * Updates a UserLog of the collection.
   * @param {string} _id - The _id of the UserLog to update.
   * @param {Object} doc - The params to update.
   * @returns {Promise<string>} - The _id of the new UserLog.
   */
  userLogUpdate: (_id: string, doc: object): Promise<number> => {
    return UserLogsCollection.updateAsync({ _id }, { $set: { ...doc } });
  },

  /**
   * Removes an UserLog from the collection.
   * @param {string} _id - The _id of the UserLog to remove.
   * @returns {Promise<number>} - The number of removed documents.
   */
  userLogRemove: ({ _id }: { _id: string }): Promise<number> => {
    return UserLogsCollection.removeAsync({ _id });
  },
}); 