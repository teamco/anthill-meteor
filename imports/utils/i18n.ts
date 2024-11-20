import { logger } from '/imports/utils/console';

type TIntl = {
  messages: string[];
  formatMessage: ({ id, defaultMessage }, {}) => string;
}

/**
 * Translate a given message id to its translated string.
 * If the id is not found, log an error and return the id as the default message.
 * @param {Object} intl - an object containing the translation messages and a formatMessage method.
 * @param {string} id - the id of the message to translate.
 * @param {Object} [params={}] - an object of parameters to pass to the formatMessage method.
 * @returns {string} - the translated string.
 */
export const t = (intl: TIntl, id: string, params = {}): string => {
  if (intl?.messages[id]) {
    return intl?.formatMessage({ id, defaultMessage: id }, { ...params });
  }

  logger({ type: 'error', msg: `Unable to find translation for [${id}], used default message.` });
  
  return id;
};
