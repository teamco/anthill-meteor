import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { createRouter } from '@tanstack/react-router';
import { App as AntdApp } from 'antd';
import { HelmetProvider } from '@dr.pogodin/react-helmet';

import { initLogger } from '/imports/utils/console.util';
import { initDayjs } from '/imports/utils/dayjs.util';

// Import the generated route tree
import {
  adminRouteTree,
  publicRouteTree,
} from '/imports/config/routes/routeConfig';

import Page404 from '/imports/ui/pages/404';
import { Navigator } from './navigator';

initDayjs();

// Create a new router instance
const adminRouter = createRouter({
  routeTree: adminRouteTree,
  defaultNotFoundComponent: () => {
    return <Page404 />;
  },
} as any);

// Create a new public router instance
const publicRouter = createRouter({
  routeTree: publicRouteTree,
  defaultNotFoundComponent: () => {
    return <Page404 />;
  },
} as any);

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof adminRouter | typeof publicRouter;
  }
}

Meteor.startup(() => {
  const container = document.getElementById('react-target');

  if (!container?.innerHTML) {
    const root = createRoot(container as Element);

    initLogger();

    root.render(
      <React.StrictMode>
        <HelmetProvider>
          <AntdApp>
            <Navigator adminRouter={adminRouter} publicRouter={publicRouter} />
          </AntdApp>
        </HelmetProvider>
      </React.StrictMode>,
    );
  }
});
