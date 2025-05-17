import { Meteor } from 'meteor/meteor';
import { NotificationInstance } from 'antd/es/notification/interface';
import { MessageInstance } from 'antd/lib/message/interface';
import { HookAPI } from 'antd/es/modal/useModal';

import { TIntl } from '/imports/utils/i18n.util';

export type TNotificationError = {
  error: string;
  errorType: string;
  message: string;
} & Meteor.Error;

export type TDeleteWarning = {
  entity?: string;
  styles?: unknown;
  title?: string;
  content?: string;
  onApprove?: () => void;
  config: Partial<TMessageConfig>;
};

export const TNotificationConfig = {
  showProgress: true,
  pauseOnHover: true,
  duration: 5,
};

export type TMessageConfig = {
  notificationApi: NotificationInstance;
  modalApi?: HookAPI;
  messageApi: MessageInstance;
  intl: TIntl;
};
