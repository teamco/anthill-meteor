import { MessageFormatElement } from 'react-intl';
import { logger } from './console.util';

export type TIntl = {
  messages: Record<string, string> | Record<string, MessageFormatElement[]>;
  formatMessage: (
    { id, defaultMessage }: { id: string; defaultMessage: string },
    // eslint-disable-next-line no-empty-pattern
    {}: { [key: string]: string },
  ) => string;
};

/**
 * Translate a given message id to its translated string.
 * If the id is not found, log an error and return the id as the default message.
 * @param {Object} intl - an object containing the translation messages and a formatMessage method.
 * @param {string} id - the id of the message to translate.
 * @param {Object} [params={}] - an object of parameters to pass to the formatMessage method.
 * @returns {string} - the translated string.
 */
export const t = (intl: TIntl, id: string, params: object = {}): string => {
  try {
    return intl?.formatMessage({ id, defaultMessage: id }, { ...params });
  } catch (e) {
    if (e instanceof Error) {
      logger({
        type: 'warn',
        msg: `Unable to find translation for [${id}], used default message.`,
      });
      logger({ type: 'error', msg: e.message });
    }

    return id;
  }
};
