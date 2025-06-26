import { Meteor } from 'meteor/meteor';

import {
  TCommonAPI,
  TLayout,
  TMessageConfig,
  TNotificationError,
  TWidget,
} from '/imports/config/types';

import { catchErrorMsg } from '/imports/utils/message.util';

type TEntity = {
  [key: string]: unknown;
  layout: TLayout & Partial<TCommonAPI>;
} & Partial<TCommonAPI>;

export const prepareToCreate = (Entity: TEntity) => {
  delete Entity.notificationApi;
  delete Entity.intl;

  delete Entity?.layout.notificationApi;
  delete Entity?.layout.intl;

  Object.keys(Entity?.layout.widgets).forEach((key) => {
    delete (Entity?.layout.widgets[key] as TWidget & Partial<TCommonAPI>).intl;
    delete (Entity?.layout.widgets[key] as TWidget & Partial<TCommonAPI>)
      .notificationApi;
  });

  return Entity;
};

/**
 * Calls a Meteor method to fetch a list of environments and
 * sets the provided state callback with the response.
 *
 * @param {string} method - The name of the Meteor method to call.
 * @param {(res: any[]) => void} setEntities - The state callback to set the
 * environment list.
 * @param {{}} opts - An object of options to pass to the Meteor method.
 * @param {Pick<TMessageConfig, 'notificationApi'>} config - Configuration
 * object containing notification API.
 * @returns {void}
 */
export const getEntities = (
  method: string,
  setEntities: (res: unknown[]) => void,
  opts: object,
  config: Pick<TMessageConfig, 'notificationApi'>,
): void => {
  Meteor.callAsync(method, opts)
    .then((res: unknown[]) => {
      setEntities(res);
    })
    .catch((err: TNotificationError) => {
      catchErrorMsg(config.notificationApi, err, () => setEntities([]));
    });
};
