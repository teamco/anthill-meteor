import { Meteor } from "meteor/meteor";
import { EnvironmentsCollection } from "/imports/collections/environments.collection";
import { TPaginateProps } from "/imports/config/types";

import './publish';

const DEFAULT_SORT: TPaginateProps['sort'] = [['metadata', 'updatedAt'], 'descend'];

Meteor.methods({

  /**
   * Fetches a range of environments from the collection based on pagination criteria.
   * @param {Object} param - An object with two properties: current (the current page number) and pageSize (the number of items per page).
   * @returns {TEnvironment[]} An array of Environment objects.
   */
  environmentsPaginate: ({ current = 1, pageSize = 10, sort = DEFAULT_SORT }: TPaginateProps): any[] => {
    let [field, order] = sort;

    if (!field || field === 'metadata') field = DEFAULT_SORT[0];
    if (!order) field = DEFAULT_SORT[1];

    return EnvironmentsCollection.find({}, {
      skip: (current - 1) * pageSize,
      limit: pageSize,
      sort: [
        typeof field === "string" ? field : field.join('.'),
        order === "ascend" ? 1 : -1
      ]
    }).fetch();
  },

  /**
   * Inserts a new Environment into the collection.
   * @param {Object} doc - The document to insert.
   * @returns {Promise<string>} - The _id of the new Environment.
   */
  environmentInsert: (doc: object): Promise<string> => {
    return EnvironmentsCollection.insertAsync(doc);
  },

  /**
   * Updates an Environment of the collection.
   * @param {string} _id - The _id of the Environment to update.
   * @param {Object} doc - The params to update.
   * @returns {Promise<string>} - The _id of the new Environment.
   */
  environmentUpdate: (_id: string, doc: object): Promise<number> => {
    return EnvironmentsCollection.updateAsync({ _id }, { $set: { ...doc } });
  },

  /**
   * Removes an Environment from the collection.
   * @param {string} _id - The _id of the Environment to remove.
   * @returns {Promise<number>} - The number of removed documents.
   */
  environmentRemove: ({ _id }: { _id: string }): Promise<number> => {
    return EnvironmentsCollection.removeAsync({ _id });
  },
}); 