import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { App as AntdApp } from 'antd';

import { initLogger } from '/imports/utils/console.util';
import { initDayjs } from '/imports/utils/dayjs.util';

// Import the generated route tree
import {
  adminRouteTree,
  publicRouteTree,
} from '/imports/config/routes/routeTree.gen';

initDayjs();

// Create a new router instance
const adminRouter = createRouter({ routeTree: adminRouteTree } as any);
const publicRouter = createRouter({ routeTree: publicRouteTree } as any);

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof adminRouter | typeof publicRouter;
  }
}

Meteor.startup(() => {
  const container = document.getElementById('react-target');

  if (!container.innerHTML) {
    const root = createRoot(container);

    initLogger();

    let router = publicRouter;

    Tracker.autorun(function () {
      if (Meteor.userId()) {
        router = adminRouter;
      }
    });

    root.render(
      <React.StrictMode>
        <AntdApp>
          <RouterProvider router={router} />
        </AntdApp>
      </React.StrictMode>,
    );
  }
});
