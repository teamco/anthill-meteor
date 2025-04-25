import React from 'react';
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { Spin } from 'antd';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import App from '/imports/ui/App';
import AuthLayout from '/imports/ui/layouts/auth.layout';
import AdminLayout from '/imports/ui/layouts/admin.layout';

import type { TAuth } from '/imports/config/types/auth.type';

function RouterSpinner() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' });
  return <Spin spinning={isLoading} />;
}

const AdminRootRoute = () => {
  return (
    <AuthLayout>
      <App>
        <AdminLayout>
          <RouterSpinner />
          <Outlet />
        </AdminLayout>
      </App>
      {/*<TanStackRouterDevtools position="bottom-right" />*/}
    </AuthLayout>
  );
};

export const Route = createRootRoute({
  component: AdminRootRoute,
});
