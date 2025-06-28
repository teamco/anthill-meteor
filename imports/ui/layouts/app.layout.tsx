import React, { JSX } from 'react';
import { Layout, message, Modal, notification } from 'antd';
import { useIntl } from 'react-intl';

import '@ant-design/v5-patch-for-react-19';

import { I18nContext } from '/imports/ui/context/i18n.context';
import { NotificationContext } from '/imports/ui/context/notification.context';

import { TIntl } from '/imports/utils/i18n.util';
import { TMessageConfig } from '/imports/config/types';

const { Content } = Layout;

type TProps = {
  children: string | JSX.Element | JSX.Element[];
};

const AppLayout: React.FC<TProps> = ({ children }): JSX.Element => {
  const intl: TIntl = useIntl();

  const [modalApi, modalHolder] = Modal.useModal();
  const [messageApi, messageHolder] = message.useMessage();
  const [notificationApi, notificationHolder] = notification.useNotification({
    stack: { threshold: 3 },
  });

  return (
    <I18nContext.Provider value={intl}>
      {messageHolder}
      {notificationHolder}
      {modalHolder}
      <NotificationContext.Provider
        value={
          { modalApi, messageApi, notificationApi } as Partial<TMessageConfig>
        }
      >
        <Layout className={'layout'}>
          <Content className={'content'}>{children}</Content>
        </Layout>
      </NotificationContext.Provider>
    </I18nContext.Provider>
  );
};

export default AppLayout;
