import { Meteor } from "meteor/meteor";
import { EnvironmentsCollection } from "/imports/collections/environments.collection";

type TPaginateProps = {
  current: number;
  pageSize: number;
}

Meteor.methods({

  /**
   * Fetches a range of environments from the collection based on pagination criteria.
   * @param {Object} param - An object with two properties: current (the current page number) and pageSize (the number of items per page).
   * @returns {TEnvironment[]} An array of Environment objects.
   */
  environmentsPaginate: ({ current = 1, pageSize = 10 }: TPaginateProps): any[] => {
    return EnvironmentsCollection.find({}, {
      skip: (current - 1) * pageSize,
      limit: pageSize,
      sort: [ 'metadata.updatedAt', -1 ]
    }).fetch();
  },

  /**
   * Inserts a new Environment into the collection.
   * @param {Object} doc - The document to insert.
   * @returns {Promise<string>} - The _id of the new Environment.
   */
  environmentsInsert: (doc: object): Promise<string> => {
    return EnvironmentsCollection.insertAsync(doc);
  },
});