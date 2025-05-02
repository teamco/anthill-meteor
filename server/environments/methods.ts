import { Meteor } from 'meteor/meteor';

import { EnvironmentsCollection } from '/imports/collections/environments.collection';
import {
  TEnvironment,
  TPaginateProps,
  TRouterTypes,
} from '/imports/config/types';

import { paginate } from '../generics/paginate';

import './publish';

Meteor.methods({
  /**
   * Fetches a range of environments from the collection based on pagination criteria.
   * @param {Object} param - An object with two properties: current (the current page number) and pageSize (the number of items per page).
   * @returns {TEnvironment[]} An array of Environment objects.
   */
  environmentsPaginate: ({
    current = 1,
    pageSize = 10,
    sort,
  }: TPaginateProps): any[] => {
    return paginate({
      Collection: EnvironmentsCollection as Mongo.Collection<
        Document,
        Document
      >,
      args: { current, pageSize, sort },
      log: {
        location: { pathname: TRouterTypes.DASHBOARD_ENVIRONMENTS },
        api: {
          method: 'environmentsPaginate',
          params: { current, pageSize, sort },
        },
        navType: 'API',
      },
    });
  },

  /**
   * Inserts a new Environment into the collection.
   * @param {Object} doc - The document to insert.
   * @returns {Promise<string>} - The _id of the new Environment.
   */
  environmentInsert: (doc: object): Promise<string> => {
    const data = {
      location: { pathname: TRouterTypes.DASHBOARD_ENVIRONMENTS },
      api: {
        method: 'environmentInsert',
        params: { ...doc },
      },
      navType: 'API',
    };

    Meteor.call('userLogInsert', { ...data });

    return EnvironmentsCollection.insertAsync(doc);
  },

  /**
   * Updates an Environment in the collection.
   * @param {Object} param - An object containing the environment ID and the document to update.
   * @param {string} param._id - The _id of the Environment to update.
   * @param {TEnvironment} param.doc - The parameters to update in the Environment.
   * @returns {Promise<number>} - The number of documents affected by the update.
   */
  environmentUpdate: async ({
    _id,
    doc,
  }: {
    _id: string;
    doc: TEnvironment;
  }): Promise<number> => {
    const user = await Meteor.userAsync();
    const environment = await EnvironmentsCollection.findOneAsync({ _id });

    const data = {
      location: { pathname: `${TRouterTypes.DASHBOARD_ENVIRONMENTS}/${_id}` },
      api: {
        method: 'environmentUpdate',
        params: {
          ...doc,
          metadata: {
            ...environment.metadata,
            updatedAt: new Date(),
            updatedBy: user._id,
          },
        },
      },
      navType: 'API',
    };

    Meteor.call('userLogInsert', { ...data });

    if (environment) {
      return EnvironmentsCollection.updateAsync(
        { _id },
        { $set: { ...data.api.params } },
      );
    }

    return 0;
  },

  /**
   * Removes an Environment from the collection.
   * @param {string} _id - The _id of the Environment to remove.
   * @returns {Promise<number>} - The number of removed documents.
   */
  environmentRemove: ({ _id }: { _id: string }): Promise<number> => {
    const data = {
      location: { pathname: TRouterTypes.DASHBOARD_ENVIRONMENTS },
      api: {
        method: 'environmentRemove',
        params: { _id },
      },
      navType: 'API',
    };

    Meteor.call('userLogInsert', { ...data });

    return EnvironmentsCollection.removeAsync({ _id });
  },
});
