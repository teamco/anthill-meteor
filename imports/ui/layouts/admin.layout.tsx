import React, { FC, useEffect, useState } from 'react';
import { ConfigProvider, Layout } from 'antd';
import { useIntl } from 'react-intl';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { defineAbilityFor } from '/imports/ui/services/ability.service';

import DrawerPanelComponent from '/imports/ui/components/DrawerPanel/drawerPanel.component';
import { LayoutHeader } from '/imports/ui/components/Layout/layoutHeader.component';
import { MenuComponent } from '/imports/ui/components/Menu/menu.component';
import { TUseMenu, useMenu } from '/imports/ui/hooks/menu.hook';

import { t, TIntl } from '/imports/utils/i18n.util';

import { useHistoryListener } from '/imports/ui/hooks/history.hook';

import SignIn from '/imports/ui/pages/authentication/signin/signin';

import { IUser } from '/imports/config/types';

import './admin.layout.module.less';

const { Header, Footer, Content } = Layout;

type TProps = {
  children: string | React.JSX.Element | React.JSX.Element[];
};

/**
 * @description The main layout for the admin pages
 * @returns {JSX.Element} The main layout for the admin pages
 */
const AdminLayout: FC<TProps> = ({ children }): React.JSX.Element => {
  const intl: TIntl = useIntl();

  const [ability, setAbility] = useState(
    defineAbilityFor(Meteor.user() as IUser),
  );
  const [drawerPanelOpen, setDrawerPanelOpen] = useState(false);

  const user = useTracker(() => Meteor.user()) as IUser;

  useHistoryListener();

  useEffect(() => {
    setAbility(defineAbilityFor(user));
  }, [user?._id]);

  const drawerProps = {
    title: t(intl, 'dashboard.drawer.title'),
    drawerPanelOpen,
    setDrawerPanelOpen,
    footer: <div className="drawerFooter">test</div>,
  };

  const menuProps: TUseMenu = useMenu(
    ability,
    drawerPanelOpen,
    setDrawerPanelOpen,
  );

  return user ? (
    <>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              activeBarBorderWidth: 0,
            },
          },
        }}
      >
        <Layout className={'layout'}>
          <Header className={'header'}>
            <LayoutHeader
              title={t(intl, 'meta.title')}
              onMenuOpen={setDrawerPanelOpen}
            />
          </Header>
          <Content className={'content'}>
            <DrawerPanelComponent {...drawerProps}>
              <MenuComponent {...menuProps} />
            </DrawerPanelComponent>
            {children}
          </Content>
          <Footer className={'footer'}>Footer</Footer>
        </Layout>
      </ConfigProvider>
    </>
  ) : (
    <SignIn />
  );
};

export default AdminLayout;
