import React, { FC, SetStateAction, useEffect, useState } from 'react';
import { ConfigProvider, Layout, message, Modal, notification } from 'antd';
import enUs from 'antd/locale/en_US';
import { Outlet } from 'react-router-dom';

import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { Locale } from 'antd/es/locale';
import { AbilityContext } from '/imports/ui/context/ability.context';
import { defineAbilityFor } from '/imports/ui/services/ability.service';
import Loader from '../components/Loader/loader.component';

const { Header, Footer, Content } = Layout;

const AdminLayout: FC = (): JSX.Element => {
  const [locale, setLocal] = useState(enUs);

  const [ability, setAbility] = useState(defineAbilityFor(Meteor.user()));
  
  const changeLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const localeValue = e.target.value;
    setLocal(localeValue as unknown as SetStateAction<Locale>);
    if (!localeValue) {
      dayjs.locale('en');
    } else {
      //dayjs.locale('zh-cn');
    }
  };

  useEffect(() => {
    setAbility(defineAbilityFor(Meteor.user()));
  }, [Meteor.user()]);

  const [modalApi, modalHolder] = Modal.useModal();
  const [messageApi, messageHolder] = message.useMessage();
  const [notificationApi, notificationHolder] = notification.useNotification({
    stack: { threshold: 3 }
  });
 
  return ability ? (
    <ConfigProvider locale={locale}>
      <Layout className={'layout'}>
        <Header className={'header'}>Header</Header>
        <Content className={'content'}>
          {messageHolder}
          {notificationHolder}
          {modalHolder}
          <Outlet context={ability} />
        </Content>
        <Footer className={'footer'}>Footer</Footer>
      </Layout>
    </ConfigProvider>
  ) : <Loader spinning={true} />
};

export default AdminLayout;