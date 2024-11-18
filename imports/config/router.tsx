import React from "react";
import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../ui/layouts/app.layout";
import AdminLayout from "../ui/layouts/admin.layout";

import ErrorPage from "../ui/pages/error";

import HomePage from "../ui/pages/home/home.page";
import DashboardPage from "../ui/pages/dashboard/dashboard.page";

export const renderRoutes = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <AppLayout/>,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout/>,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/admin",
          element: <DashboardPage />,
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