import { MessageInstance } from 'antd/es/message/interface';
import { HookAPI } from 'antd/es/modal/useModal';
import { NotificationInstance } from 'antd/es/notification/interface';
import { createContext } from 'react';

type TNotification = {
  modalApi: HookAPI;
  messageApi: MessageInstance;
  notificationApi: NotificationInstance;
};

export const NotificationContext = createContext({
  modalApi: null,
  messageApi: null,
  notificationApi: null,
} as unknown as TNotification);
