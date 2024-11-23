import React, { FC, useEffect, useState } from 'react';
import { ConfigProvider, Layout, message, Modal, notification } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { AbilityContext, AuthenticationContext } from '/imports/ui/context/authentication.context';
import { I18nContext } from '/imports/ui/context/i18n.context';
import { NotificationContext } from '/imports/ui/context/notification.context';

import { defineAbilityFor } from '/imports/ui/services/ability.service';

import Loader from '/imports/ui/components/Loader/loader.component';
import DrawerPanelComponent from '/imports/ui/components/DrawerPanel/drawerPanel.component';
import { LayoutHeader } from '/imports/ui/components/Layout/layoutHeader.component';
import { MenuComponent } from '/imports/ui/components/Menu/menu.component';
import { useMenu } from '/imports/ui/components/Menu/menu.use';

import { nCache } from '/imports/utils/message.util';
import { t, TIntl } from '/imports/utils/i18n.util';

const { Header, Footer, Content } = Layout;

/**
 * @description The main layout for the admin pages
 * @param {ability} The ability to access the admin pages
 * @returns {JSX.Element} The main layout for the admin pages
 */
const AdminLayout: FC = (): JSX.Element => {
  const intl: TIntl = useIntl();
  const history = useNavigate();

  const [ability, setAbility] = useState(defineAbilityFor(Meteor.user()));
  const [drawerPanelOpen, setDrawerPanelOpen] = useState(false);

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

  const drawerProps = {
    title: t(intl, 'dashboard.drawer.title'),
    drawerPanelOpen,
    setDrawerPanelOpen,
    footer: (
      <div className="drawerFooter">
        test
      </div>
    )
  }

  const menuProps = useMenu(intl, ability, history, drawerPanelOpen);
  
  return ability ? (
    <I18nContext.Provider value={intl}>
      <AuthenticationContext.Provider value={ability}>
        <AbilityContext.Provider value={ability}>
          <NotificationContext.Provider value={{ modalApi, messageApi, notificationApi }}>
            <ConfigProvider theme={{
              components: {
                Menu: {
                  activeBarBorderWidth: 0
                }
              }
            }}>
              <Layout className={'layout'}>
                <Header className={'header'}>
                  <LayoutHeader
                    title={t(intl, 'meta.title')}
                    onMenuOpen={setDrawerPanelOpen}
                  />
                </Header>
                <Content className={'content'}>
                  {messageHolder}
                  {notificationHolder}
                  {modalHolder}
                  <DrawerPanelComponent {...drawerProps}>
                    <MenuComponent {...menuProps}/>
                  </DrawerPanelComponent>
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