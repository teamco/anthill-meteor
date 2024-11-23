import React from "react";
import { createBrowserRouter } from "react-router-dom";

import AppLayout from "/imports/ui/layouts/app.layout";
import AdminLayout from "/imports/ui/layouts/admin.layout";

import Page404 from "/imports/ui/pages/404";

import HomePage from "/imports/ui/pages/home/home.page";
import DashboardPage from "/imports/ui/pages/dashboard/dashboard.page";
import EnvironmentsPage from "/imports/ui/pages/dashboard/environments/environments.page";
import WidgetsPage from "/imports/ui/pages/dashboard/widgets/widgets.page";

/**
 * Configures and returns the router for the application using `createBrowserRouter`.
 *
 * The router defines the application's routes and their associated components,
 * error elements, and layout structures. The main structure includes:
 * - The root path "/" with `AppLayout` and `HomePage`.
 * - A "/dashboard" path with `AdminLayout`, containing the `DashboardPage`, 
 *   `EnvironmentsPage`, and `WidgetsPage` as children routes.
 *
 * Additionally, a `Page404` component is used as the error element for undefined routes.
 * The router is configured with advanced options under the `future` key to enable
 * specific features and behaviors in line with the latest version 7 updates.
 *
 * @returns {Router} The configured browser router for the application.
 */
export const renderRoutes = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <AppLayout/>,
      errorElement: <Page404 />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
      ],
    },
    {
      path: "/dashboard",
      element: <AdminLayout/>,
      errorElement: <Page404 />,
      children: [
        {
          path: "/dashboard",
          element: <DashboardPage />,
        },
        {
          path: "/dashboard/environments",
          element: <EnvironmentsPage />,
        },
        {
          path: "/dashboard/widgets",
          element: <WidgetsPage />,
        },
      ],
    },
  ], {
    basename: "/",
    future: {
      // Normalize `useNavigation()`/`useFetcher()` `formMethod` to uppercase
      v7_normalizeFormMethod: true,
      v7_skipActionErrorRevalidation: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_partialHydration: true
    }
  });
};