import { createContext } from 'react';
import { TNotification } from '/imports/config/types';

export const NotificationContext = createContext({
  modalApi: null,
  messageApi: null,
  notificationApi: null,
} as unknown as TNotification);
