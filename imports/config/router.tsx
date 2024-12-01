import React from "react";
import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "/imports/ui/layouts/admin.layout";
import SignUp from "/imports/ui/pages/authentication/signup/signup";
import SignIn from "/imports/ui/pages/authentication/signin/signin";
import AuthLayout from "/imports/ui/layouts/auth.layout";
import Page404 from "/imports/ui/pages/404";

import EnvironmentsPage from "/imports/ui/pages/dashboard/environments/environments.page";
import EnvironmentEdit from "/imports/ui/pages/dashboard/environments/environment/environment.edit";
import EnvironmentPreview from "/imports/ui/pages/dashboard/environments/environment/preview/environment.preview";

import DashboardPage from "/imports/ui/pages/dashboard/dashboard.page";
import WidgetsPage from "/imports/ui/pages/dashboard/widgets/widgets.page";
import UserLogsPage from "/imports/ui/pages/dashboard/userLogs/usreLogs.page";

/**
 * Renders the application routes using `createBrowserRouter`.
 * 
 * The route configuration includes:
 * - A root path ("/") with an `AuthLayout` and error fallback to `Page404`.
 * - Nested routes under "/dashboard" protected by `AdminLayout`, allowing access to:
 *   - DashboardPage, EnvironmentsPage, EnvironmentEdit, and WidgetsPage.
 *   - Dynamic routes for environment and version IDs.
 *   - UserLogsPage.
 * - Separate routes for authentication (`/signup` and `/signin`).
 * 
 * The router is configured with a basename of "/" and various future-facing options
 * for form method normalization, error revalidation, path handling, fetcher persistence,
 * and partial hydration.
 */
export const renderRoutes = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      errorElement: <Page404 />,
      children: [
        {
          path: "/dashboard",
          element: <AdminLayout />,
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
              path: "/dashboard/environments/:environmentId",
              element: <EnvironmentEdit />,
            },
            {
              path: "/dashboard/environments/:environmentId/version/:versionId",
              element: <EnvironmentPreview />,
            },
            {
              path: "/dashboard/widgets",
              element: <WidgetsPage />,
            },
            {
              path: "/dashboard/userLogs",
              element: <UserLogsPage />,
            },
          ],
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "/signin",
          element: <SignIn />,
        }
      ]
    }
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