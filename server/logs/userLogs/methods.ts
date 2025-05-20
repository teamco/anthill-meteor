import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { TPaginateProps } from '/imports/config/types';
import { UserLogsCollection } from '/imports/collections/userLogs.collection';

import { paginate, TLog } from '/server/generics/paginate';

import './publish';

Meteor.methods({
  /**
   * Fetches a range of user logs from the collection based on pagination criteria.
   * @param {Object} param - An object with three properties: current (the current page number), pageSize (the number of items per page) and sort (the sort criteria).
   * @returns {any[]} An array of UserLogs objects.
   */
  userLogsPaginate: ({
    current = 1,
    pageSize = 10,
    sort,
  }: TPaginateProps): any[] => {
    return paginate({
      Collection: UserLogsCollection as unknown as Mongo.Collection<
        Document,
        Document
      >,
      args: { current, pageSize, sort },
      log: null as unknown as TLog,
    });
  },

  /**
   * Inserts a new UserLog into the collection.
   * @param {Object} doc - The document to insert.
   * @returns {Promise<string>} - The _id of the new UserLog.
   */
  userLogInsert: async (doc: object): Promise<string> => {
    const user = await Meteor.userAsync();

    return UserLogsCollection.insertAsync({
      ...doc,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user?._id || null,
        updatedBy: user?._id || null,
      },
    });
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
