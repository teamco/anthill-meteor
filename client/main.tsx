import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { App as AntdApp } from 'antd';
import { HelmetProvider } from '@dr.pogodin/react-helmet';

import { initLogger } from '/imports/utils/console.util';
import { initDayjs } from '/imports/utils/dayjs.util';

import { TRouterTypes } from '/imports/config/types';

// Import the generated route tree
import {
  adminRouteTree,
  publicRouteTree,
} from '/imports/config/routes/routeTree.gen';

import Page404 from '/imports/ui/pages/404';

initDayjs();

type TWindow = Window &
  typeof globalThis & {
    preRenderReady: boolean;
  };

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

    let router = publicRouter;

    Tracker.autorun(function () {
      if (Meteor.userId()) {
        router = adminRouter;
      }

      (window as TWindow).preRenderReady = true;
    });

    root.render(
      <React.StrictMode>
        <HelmetProvider>
          <AntdApp>
            <RouterProvider router={router} key={window.location.pathname} />
          </AntdApp>
        </HelmetProvider>
      </React.StrictMode>,
    );
  }
});
