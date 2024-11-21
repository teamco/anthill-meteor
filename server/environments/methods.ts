import { Meteor } from "meteor/meteor";
import { EnvironmentsCollection } from "/imports/collections/environments.collection";

type TPaginateProps = {
  current: number;
  pageSize: number;
  sort?: [string[] | string, "descend" | "ascend"];
}

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
  environmentsInsert: (doc: object): Promise<string> => {
    return EnvironmentsCollection.insertAsync(doc);
  },
});