import { Meteor } from 'meteor/meteor';

import { WidgetsCollection } from '/imports/collections/widgets.collection';

import { TWidget } from '/imports/config/types';
import {
  TMessageConfig,
  TNotificationError,
} from '/imports/config/types/notification.type';

import { t } from '/imports/utils/i18n.util';
import {
  successSaveMsg,
  catchErrorMsg,
  successDeleteMsg,
  catchWarnMsg,
} from '/imports/utils/message.util';

import { prepareToCreate } from './shared.service';

/**
 * Creates a new widget in the database.
 *
 * This function makes an asynchronous call to add the specified widget
 * to the collection. Upon successful creation, a success message is displayed
 * and the handleRefresh function is called to update the UI. If the creation
 * fails, a warning message is shown. Any errors during the process are caught
 * and handled.
 *
 * @param {TWidget} widget - The widget object to create.
 * @param {() => void} handleRefresh - Callback function to refresh the widget
 * list after creation.
 * @param {TMessageConfig} config - Configuration object containing message and
 * notification APIs and internationalization context.
 * @returns {void}
 */
export const createWidget = (
  widget: TWidget,
  handleRefresh: () => void,
  config: TMessageConfig,
): void => {
  Meteor.callAsync('widgetInsert', {
    ...(prepareToCreate(widget) as unknown as object),
  })
    .then((_id: string) => {
      successSaveMsg(config.messageApi, config.intl, 'Widget');
      handleRefresh();
    })
    .catch((err: TNotificationError) => {
      catchErrorMsg(config.notificationApi, err);
    });
};

/**
 * Deletes an widget by its _id.
 *
 * This function makes an asynchronous call to remove the specified widget
 * from the collection. Upon successful deletion, a success message is displayed
 * and the handleRefresh function is called to update the UI. If the deletion
 * fails, a warning message is shown. Any errors during the process are caught
 * and handled.
 *
 * @param {string} _id - The unique identifier of the widget to delete.
 * @param {() => void} handleRefresh - Callback function to refresh the widget
 * list after deletion.
 * @param {TMessageConfig} config - Configuration object containing message and
 * notification APIs and internationalization context.
 * @returns {void}
 */
export const deleteWidget = (
  _id: string,
  handleRefresh: () => void,
  config: TMessageConfig,
): void => {
  Meteor.callAsync('widgetRemove', { _id })
    .then((res: number) => {
      if (res > 0) {
        successDeleteMsg(config.messageApi, config.intl, 'Widget');
        handleRefresh();
      } else {
        catchWarnMsg(config.notificationApi, {
          errorType: 'warning',
          message: t(config.intl, 'error.warningMsg'),
          error: 'Error 400',
          name: 'deleteWidget',
        });
      }
    })
    .catch((err: TNotificationError) => {
      catchErrorMsg(config.notificationApi, err);
    });
};

/**
 * Finds a widget in the collection by a specified key and value.
 *
 * @param {string} key - The key to search for in the collection.
 * @param {string} value - The value to match for the specified key.
 * @returns {TWidget} The widget found in the collection or undefined
 * if not found.
 */
export const getWidgetBy = (key: string, value: string): TWidget =>
  WidgetsCollection.findOne({
    [key]: value,
    'metadata.createdBy': Meteor.userId(),
  }) as TWidget;
