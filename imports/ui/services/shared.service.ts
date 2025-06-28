import { Meteor } from 'meteor/meteor';

import {
  TLayout,
  TLayoutWidget,
  TMessageConfig,
  TNotificationError,
  TWidget,
} from '/imports/config/types';

import { catchErrorMsg } from '/imports/utils/message.util';

type TEntity = {
  [key: string]: unknown;
  layout?: (TLayout & Partial<TMessageConfig>) & {
    widgets?: TLayoutWidget | Record<string, TWidget & Partial<TMessageConfig>>;
  };
} & Partial<TMessageConfig>;

/**
 * Prepare an entity to be created.
 *
 * Removes notificationApi and intl properties from the entity itself and all
 * its widgets.
 *
 * @param {TEntity} Entity The entity to prepare.
 *
 * @returns {TEntity} The same entity, but with notificationApi and intl removed.
 */
export const prepareToCreate = <T extends TEntity>(Entity: T): T => {
  // Remove notificationApi and intl from the entity itself
  delete Entity.notificationApi;
  delete Entity.intl;

  // Remove notificationApi and intl from the layout, if present
  if (Entity.layout) {
    delete Entity.layout.notificationApi;
    delete Entity.layout.intl;

    // Remove notificationApi and intl from each widget, if widgets exist
    if (Entity.layout.widgets && typeof Entity.layout.widgets === 'object') {
      Object.keys(Entity.layout.widgets).forEach((key) => {
        const widget = Entity.layout!.widgets![key] as TWidget &
          Partial<TMessageConfig>;
        if (widget) {
          delete widget.intl;
          delete widget.notificationApi;
        }
      });
    }
  }

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
