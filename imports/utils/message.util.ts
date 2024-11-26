import { t } from "./i18n.util";

export const nCache = {
  intl: null,
  messageApi: null,
  modalApi: null,
  notificationApi: null,
  set(key: string, value: any): void {
    this[key] = value;
  },
  get(key: string): any {
    return this[key];
  }
};

/**
 * Displays a success message using the NotificationContext.
 * 
 * @param instance - The name of the entity that was successfully saved. Defaults to 'Entity'.
 */
export const successSaveMsg = (instance: string = 'Entity'): void => {
  const messageApi = nCache.get('messageApi');
  const intl = nCache.get('intl');

  const msg = t(intl, 'message.success.create', { instance });

  messageApi.success(msg);
};

/**
 * Displays a success message using the NotificationContext.
 * 
 * @param instance - The name of the entity that was successfully updated. Defaults to 'Entity'.
 */
export const successUpdateMsg = (instance: string = 'Entity'): void => {
  const messageApi = nCache.get('messageApi');
  const intl = nCache.get('intl');

  const msg = t(intl, 'message.success.update', { instance });

  messageApi.success(msg);
};

/**
 * Displays a success message using the MessageContext when an entity is deleted.
 * @param instance - The name of the entity that was deleted. Defaults to 'Entity'.
 */
export const successDeleteMsg = (instance: string = 'Entity'): void => {
  const messageApi = nCache.get('messageApi');
  const intl = nCache.get('intl');

  const msg = t(intl, 'message.success.delete', { instance: instance.toLocaleUpperCase() });

  messageApi.success(msg);
};

type TError = {
  error: string;
  errorType: string;
  message: string;
}

/**
 * Displays an error notification using the NotificationContext.
 * Optionally executes a fallback function if provided.
 *
 * @param e - The error object containing error details.
 * @param fallback - An optional function to execute as a fallback action.
 */
export const catchErrorMsg = (e: TError, fallback?: () => void): void => {
  const notificationApi = nCache.get('notificationApi');

  typeof fallback === 'function' && fallback();

  notificationApi.error({
    message: `${e.error}: ${e.errorType}`,
    description: e.message
  });
}

/**
 * Displays an error notification with a fixed message "400: Bad Request".
 *
 * @param {{ message: string }} e - The error object containing error details to be displayed.
 */
export const catchClassErrorMsg = (e: { message: string }): void => {
  const notificationApi = nCache.get('notificationApi');

  notificationApi.error({
    message: `400: Bad Request`,
    description: e.message
  });
}


/**
 * Displays an warning notification using the NotificationContext.
 *
 * @param e - The error object containing error details.
 */
export const catchWarnMsg = (e: TError): void => {
  const notificationApi = nCache.get('notificationApi');

  notificationApi.warning({
    message: `${e.error}: ${e.errorType}`,
    description: e.message
  });
}