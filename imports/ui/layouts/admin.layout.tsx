import React, { FC } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import './style/app.layout.less';

const { Header, Footer, Content } = Layout;

const AdminLayout: FC = (): JSX.Element => {
  
  return (
    <Layout className={'layout'}>
      <Header className={'header'}>Header</Header>
      <Content className={'content'}><Outlet /></Content>
      <Footer className={'footer'}>Footer</Footer>
    </Layout>
  )
};

export default AdminLayout;