import { Meteor } from 'meteor/meteor';

import { TLayout } from '/imports/config/types';
import {
  TMessageConfig,
  TNotificationError,
} from '/imports/config/types/notification.type';

import { t } from '/imports/utils/i18n.util';
import {
  catchErrorMsg,
  successDeleteMsg,
  catchWarnMsg,
  successUpdateMsg,
} from '/imports/utils/message.util';

/**
 * Deletes an layout by its _id.
 *
 * This function makes an asynchronous call to remove the specified layout
 * from the collection. Upon successful deletion, a success message is displayed
 * and the handleRefresh function is called to update the UI. If the deletion
 * fails, a warning message is shown. Any errors during the process are caught
 * and handled.
 *
 * @param {string} _id - The unique identifier of the layout to delete.
 * @param {() => void} handleRefresh - Callback function to refresh the layout
 * list after deletion.
 * @param {TMessageConfig} config - Configuration object containing message and
 * notification APIs and internationalization context.
 * @returns {void}
 */
export const deleteLayout = (
  _id: string,
  handleRefresh: () => void,
  config: TMessageConfig,
): void => {
  Meteor.callAsync('layoutRemove', { _id })
    .then((res: number) => {
      if (res > 0) {
        successDeleteMsg(config.messageApi, config.intl, 'Layout');
        handleRefresh();
      } else {
        catchWarnMsg(config.notificationApi, {
          errorType: 'warning',
          message: t(config.intl, 'error.warningMsg'),
          error: 'Error 400',
          name: 'deleteLayout',
        });
      }
    })
    .catch((err: TNotificationError) => {
      catchErrorMsg(config.notificationApi, err);
    });
};

export const updateTemplate = (
  _id: string,
  doc: Pick<TLayout, 'template'>,
  config: TMessageConfig,
) => {
  Meteor.callAsync('layoutTemplateUpdate', { _id, doc })
    .then((res: number) => {
      if (res > 0) {
        successUpdateMsg(config.messageApi, config.intl, 'Layout');
      } else {
        catchWarnMsg(config.notificationApi, {
          errorType: 'warning',
          message: t(config.intl, 'error.warningMsg'),
          error: 'Error 400',
          name: '',
        });
      }
    })
    .catch((err: TNotificationError) => {
      catchErrorMsg(config.notificationApi, err);
    });
};
