import React, { FC, useEffect, useState } from 'react';
import { ConfigProvider, Layout, message, Modal, notification } from 'antd';
import { Outlet } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { AbilityContext, AuthenticationContext } from '/imports/ui/context/authentication.context';
import { I18nContext } from '/imports/ui/context/i18n.context';
import { NotificationContext } from '/imports/ui/context/notification.context';

import { defineAbilityFor } from '/imports/ui/services/ability.service';

import Loader from '/imports/ui/components/Loader/loader.component';

import { nCache } from '/imports/utils/message.util';

const { Header, Footer, Content } = Layout;

const AdminLayout: FC = (): JSX.Element => {
  const intl = useIntl();

  const [ability, setAbility] = useState(defineAbilityFor(Meteor.user()));

  useEffect(() => {
    setAbility(defineAbilityFor(Meteor.user()));
  }, [Meteor.user()]);

  const [modalApi, modalHolder] = Modal.useModal();
  const [messageApi, messageHolder] = message.useMessage();
  const [notificationApi, notificationHolder] = notification.useNotification({
    stack: { threshold: 3 }
  });

  nCache.set('intl', intl);
  nCache.set('messageApi', messageApi);
  nCache.set('modalApi', modalApi);
  nCache.set('notificationApi', notificationApi);

  return ability ? (
      <I18nContext.Provider value={intl}>
        <AuthenticationContext.Provider value={ability}>
          <AbilityContext.Provider value={ability}>
            <NotificationContext.Provider value={{ modalApi, messageApi, notificationApi }}>
              <ConfigProvider>
                <Layout className={'layout'}>
                  <Header className={'header'}>Header</Header>
                  <Content className={'content'}>
                    {messageHolder}
                    {notificationHolder}
                    {modalHolder}
                    <Outlet />
                  </Content>
                  <Footer className={'footer'}>Footer</Footer>
                </Layout>
              </ConfigProvider>
            </NotificationContext.Provider>
          </AbilityContext.Provider>
        </AuthenticationContext.Provider>
      </I18nContext.Provider>
  ) : <Loader spinning={true} />
};

export default AdminLayout;