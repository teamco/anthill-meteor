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

  const msg = t(intl, 'message.success.save', { instance });

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
export const catchMsg = (e: TError, fallback?: () => void): void => {
  const notificationApi = nCache.get('notificationApi');

  typeof fallback === 'function' && fallback();

  notificationApi.error({
    message: `${e.error}: ${e.errorType}`,
    description: e.message
  });
}