import React, { FC } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import './app.layout.module.less';

const { Header, Footer, Content } = Layout;

const AppLayout: FC = (): JSX.Element => {
  
  return (
    <Layout className={'layout'}>
      <Header className={'header'}>Header</Header>
      <Content className={'content'}><Outlet /></Content>
      <Footer className={'footer'}>Footer</Footer>
    </Layout>
  )
};

export default AppLayout;