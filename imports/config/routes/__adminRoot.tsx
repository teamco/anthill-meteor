import React from 'react';
import {
  createRootRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { Spin } from 'antd';

import AuthLayout from '/imports/ui/layouts/auth.layout';
import AdminLayout from '/imports/ui/layouts/admin.layout';
import AppLayout from '/imports/ui/layouts/app.layout';

function RouterSpinner() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' });
  return <Spin spinning={isLoading} />;
}

const AdminRootRoute = () => {
  return (
    <AuthLayout>
      <AppLayout>
        <RouterSpinner />
        <AdminLayout>
          <RouterSpinner />
          <Outlet />
        </AdminLayout>
      </AppLayout>
    </AuthLayout>
  );
};

export const Route = createRootRoute({
  component: AdminRootRoute,
});
