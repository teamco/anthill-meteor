import { logger } from '/imports/utils/console';

export const t = (intl: any, id: string, params = {}): string => {
  if (intl?.messages[id]) {
    return intl?.formatMessage({ id, defaultMessage: id }, { ...params });
  }

  logger({ type: 'error', msg: `Unable to find translation for [${id}], used default message.` });
  
  return id;
};
