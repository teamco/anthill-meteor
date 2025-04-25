import { Meteor } from "meteor/meteor";
import { LayoutsCollection } from "/imports/collections/layouts.collection";
import { TPaginateProps, TRouterTypes, TLayout } from '/imports/config/types';

import { paginate } from "../generics/paginate";

import './publish';

Meteor.methods({

  /**
   * Fetches a range of layouts from the collection based on pagination criteria.
   * @param {Object} param - An object with two properties: current (the current page number) and pageSize (the number of items per page).
   * @returns {TLayout[]} An array of Layout objects.
   */
  layoutsPaginate: ({ current = 1, pageSize = 10, sort }: TPaginateProps): TLayout[] => {
    return paginate({
      Collection: LayoutsCollection as Mongo.Collection<Document, Document>,
      args: { current, pageSize, sort },
      log: {
        location: { pathname: TRouterTypes.DASHBOARD_LAYOUTS },
        api: {
          method: 'layoutsPaginate',
          params: { current, pageSize, sort }
        },
        navType: 'API'
      }
    });
  },

  /**
   * Inserts a new Layout into the collection.
   * @param {Object} doc - The document to insert.
   * @returns {Promise<string>} - The _id of the new Layout.
   */
  layoutInsert: (doc: object): Promise<string> => {
    const data = {
      location: { pathname: TRouterTypes.DASHBOARD_LAYOUTS },
      api: {
        method: 'layoutInsert',
        params: { ...doc }
      },
      navType: 'API'
    }

    Meteor.call('userLogInsert', { ...data });

    return LayoutsCollection.insertAsync(doc);
  },

  /**
   * Updates a Layout of the collection.
   * @param {string} _id - The _id of the Layout to update.
   * @param {Object} doc - The params to update.
   * @returns {Promise<string>} - The _id of the new Layout.
   */
  layoutUpdate: async (_id: string, doc: object): Promise<number> => {
    const user = await Meteor.userAsync();
    const layout = await LayoutsCollection.findOneAsync({ _id });

    const data = {
      location: { pathname: `${TRouterTypes.DASHBOARD_LAYOUTS}/${_id}` },
      api: {
        method: 'layoutUpdate',
        params: {
          ...doc,
          metadata: {
            ...layout.metadata,
            updatedAt: new Date(),
            updatedBy: user._id
          }
        }
      },
      navType: 'API'
    }

    Meteor.call('userLogInsert', { ...data });

    if (layout) {
      return LayoutsCollection.updateAsync({ _id }, { $set: { ...data.api.params } });
    }

    return 0;
  },

  /**
   * Removes a Layout from the collection.
   * @param {string} _id - The _id of the Layout to remove.
   * @returns {Promise<number>} - The number of removed documents.
   */
  layoutRemove: ({ _id }: { _id: string }): Promise<number> => {
    const data = {
      location: { pathname: TRouterTypes.DASHBOARD_LAYOUTS },
      api: {
        method: 'layoutRemove',
        params: { _id }
      },
      navType: 'API'
    }

    Meteor.call('userLogInsert', { ...data });

    return LayoutsCollection.removeAsync({ _id });
  },
});
