import React from 'react';
import {
  createRootRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { Spin } from 'antd';

import App from '/imports/ui/App';
import AuthLayout from '/imports/ui/layouts/auth.layout';
import AdminLayout from '/imports/ui/layouts/admin.layout';

function RouterSpinner() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' });
  return <Spin spinning={isLoading} />;
}

const PublicRootRoute = () => {
  return (
    <AuthLayout>
      <App>
        <RouterSpinner />
        <Outlet />
      </App>
    </AuthLayout>
  );
};

export const Route = createRootRoute({
  component: PublicRootRoute,
});
