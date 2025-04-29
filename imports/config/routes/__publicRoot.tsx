import React from 'react';
import {
  createRootRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { Spin } from 'antd';

import App from '/imports/ui/App';

function RouterSpinner() {
  const isLoading = useRouterState({ select: (s) => s.status === 'pending' });
  return <Spin spinning={isLoading} />;
}

const PublicRootRoute = () => {
  return (
    <App>
      <RouterSpinner />
      <Outlet />
    </App>
  );
};

export const Route = createRootRoute({
  component: PublicRootRoute,
});
