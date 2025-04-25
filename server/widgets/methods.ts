import { Meteor } from "meteor/meteor";

import { WidgetsCollection } from "/imports/collections/widgets.collection";
import { TPaginateProps, TRouterTypes } from '/imports/config/types';

import { paginate } from "../generics/paginate";

import './publish';

Meteor.methods({

  /**
   * Fetches a range of widgets from the collection based on pagination criteria.
   * @param {Object} param - An object with three properties: current (the current page number), pageSize (the number of items per page) and sort (the sort criteria).
   * @returns {any[]} An array of Widget objects.
   */
  widgetsPaginate: ({ current = 1, pageSize = 10, sort }: TPaginateProps): any[] => {
    return paginate({
      Collection: WidgetsCollection as Mongo.Collection<Document, Document>,
      args: { current, pageSize, sort },
      log: {
        location: { pathname: TRouterTypes.DASHBOARD_WIDGETS },
        api: {
          method: 'widgetsPaginate',
          params: { current, pageSize, sort }
        },
        navType: 'API'
      }
    });
  },

  /**
   * Inserts a new Widget into the collection.
   * @param {Object} doc - The document to insert.
   * @returns {Promise<string>} - The _id of the new Widget.
   */
  widgetInsert: (doc: object): Promise<string> => {
    const data = {
      location: { pathname: TRouterTypes.DASHBOARD_WIDGETS },
      api: {
        method: 'widgetInsert',
        params: { ...doc }
      },
      navType: 'API'
    }

    Meteor.call('userLogInsert', { ...data });

    return WidgetsCollection.insertAsync(doc);
  },

  /**
   * Updates a Widget of the collection.
   * @param {string} _id - The _id of the Widget to update.
   * @param {Object} doc - The params to update.
   * @returns {Promise<string>} - The _id of the new Widget.
   */
  widgetUpdate: async (_id: string, doc: object): Promise<number> => {
    const user = await Meteor.userAsync();
    const widget = await WidgetsCollection.findOneAsync({ _id });

    const data = {
      location: { pathname: `${TRouterTypes.DASHBOARD_WIDGETS}/${_id}` },
      api: {
        method: 'widgetUpdate',
        params: {
          ...doc,
          metadata: {
            ...widget.metadata,
            updatedAt: new Date(),
            updatedBy: user._id
          }
        }
      },
      navType: 'API'
    }

    Meteor.call('userLogInsert', { ...data });

    if (widget) {
      return WidgetsCollection.updateAsync({ _id }, { $set: { ...data.api.params } });
    }

    return 0;
  },

  /**
   * Removes an Widget from the collection.
   * @param {string} _id - The _id of the Widget to remove.
   * @returns {Promise<number>} - The number of removed documents.
   */
  widgetRemove: ({ _id }: { _id: string }): Promise<number> => {
    const data = {
      location: { pathname: TRouterTypes.DASHBOARD_WIDGETS },
      api: {
        method: 'widgetRemove',
        params: { _id }
      },
      navType: 'API'
    }

    Meteor.call('userLogInsert', { ...data });

    return WidgetsCollection.removeAsync({ _id });
  },
});
