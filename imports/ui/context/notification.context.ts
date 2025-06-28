import { createContext } from 'react';
import { TMessageConfig } from '/imports/config/types';

export const NotificationContext = createContext({
  modalApi: null,
  messageApi: null,
  notificationApi: null,
} as unknown as Partial<TMessageConfig>);
