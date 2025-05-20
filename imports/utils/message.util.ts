import { MessageInstance } from 'antd/es/message/interface';
import { NotificationInstance } from 'antd/es/notification/interface';
import { Meteor } from 'meteor/meteor';

import {
  TNotificationConfig,
  TNotificationError,
} from '/imports/config/types/notification.type';

import { t, TIntl } from './i18n.util';

/**
 * Displays a success message using the NotificationContext.
 *
 * @param {MessageInstance} messageApi - The message API to use for displaying the message.
 * @param {TIntl} intl - The internationalization context to use for translations.
 * @param instance - The name of the entity that was successfully saved. Defaults to 'Entity'.
 */
export const successSaveMsg = (
  messageApi: MessageInstance,
  intl: TIntl,
  instance: string = 'Entity',
): void => {
  const msg = t(intl, 'message.success.create', { instance });
  messageApi.success(msg);
};

/**
 * Displays a success message using the NotificationContext.
 *
 * @param {MessageInstance} messageApi - The message API to use for displaying the message.
 * @param {TIntl} intl - The internationalization context to use for translations.
 * @param instance - The name of the entity that was successfully updated. Defaults to 'Entity'.
 */
export const successUpdateMsg = (
  messageApi: MessageInstance,
  intl: TIntl,
  instance: string = 'Entity',
): void => {
  const msg = t(intl, 'message.success.update', { instance });
  messageApi.success(msg);
};

/**
 * Displays a success message using the MessageContext when an entity is deleted.
 *
 * @param {MessageInstance} messageApi - The message API to use for displaying the message.
 * @param {TIntl} intl - The internationalization context to use for translations.
 * @param instance - The name of the entity that was deleted. Defaults to 'Entity'.
 */
export const successDeleteMsg = (
  messageApi: MessageInstance,
  intl: TIntl,
  instance: string = 'Entity',
): void => {
  const msg = t(intl, 'message.success.delete', {
    instance: instance.toLocaleUpperCase(),
  });

  messageApi.success(msg);
};

/**
 * Displays an error notification using the NotificationContext.
 * Optionally executes a fallback function if provided.
 *
 * @param {NotificationInstance} notificationApi - The notification API to use for displaying the error message.
 * @param e - The error object containing error details.
 * @param fallback - An optional function to execute as a fallback action.
 */
export const catchErrorMsg = (
  notificationApi: NotificationInstance,
  e: TNotificationError,
  fallback?: () => void,
): void => {
  if (typeof fallback === 'function') fallback();

  notificationApi.error({
    message: `${e.error}: ${e.errorType}`,
    description: e.message,
    ...TNotificationConfig,
  });

  throw new Meteor.Error(400, e.message);
};

/**
 * Displays an error notification with a fixed message "400: Bad Request".
 *
 * @param {NotificationInstance} notificationApi - The notification API to use for displaying the error message.
 * @param {{ message: string }} e - The error object containing error details to be displayed.
 */
export const catchClassErrorMsg = (
  notificationApi: NotificationInstance,
  e: { message: string },
): void => {
  notificationApi.error({
    message: '400: Bad Request',
    description: e.message,
    ...TNotificationConfig,
  });

  throw new Meteor.Error(400, e.message);
};

/**
 * Displays an warning notification using the NotificationContext.
 *
 * @param {NotificationInstance} notificationApi - The notification API to use for displaying the error message.
 * @param e - The error object containing error details.
 */
export const catchWarnMsg = (
  notificationApi: NotificationInstance,
  e: TNotificationError,
): void => {
  console.warn(e);

  notificationApi.warning({
    message: `${e.error}: ${e.errorType}`,
    description: e.message,
    ...TNotificationConfig,
  });
};
