import { Meteor } from 'meteor/meteor';
import { NotificationInstance } from 'antd/es/notification/interface';

import {
  TMessageConfig,
  TNotificationError,
} from '/imports/config/types/notification.type';

import { catchErrorMsg } from '/imports/utils/message.util';
import { TIntl } from '/imports/utils/i18n.util';

type TEntity = {
  notificationApi?: NotificationInstance;
  intl?: TIntl;
  [key: string]: unknown;
};

export const prepareToCreate = (Entity: TEntity) => {
  delete Entity.notificationApi;
  delete Entity.intl;

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
