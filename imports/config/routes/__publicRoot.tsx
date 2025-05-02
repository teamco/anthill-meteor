import React from 'react';
import {
  createRootRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { Spin } from 'antd';

import AuthLayout from '/imports/ui/layouts/auth.layout';
import AppLayout from '/imports/ui/layouts/app.layout';

function RouterSpinner() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' });
  return <Spin spinning={isLoading} />;
}

const PublicRootRoute = () => {
  return (
    <AuthLayout>
      <AppLayout>
        <RouterSpinner />
        <Outlet />
      </AppLayout>
    </AuthLayout>
  );
};

export const Route = createRootRoute({
  component: PublicRootRoute,
});
