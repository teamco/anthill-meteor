import { createFileRoute, RootRoute, Route } from '@tanstack/react-router';
import { TRouterTypes } from '/imports/config/types';

import SignIn from '/imports/ui/pages/authentication/signin/signin';
import { Route as SignupRouteImport } from '/imports/ui/pages/authentication/signup/signup';

import { Route as AdminRouteImport } from './__adminRoot';
import { Route as PublicRouteImport } from './__publicRoot';

import { Route as DashboardRouteImport } from '/imports/ui/pages/dashboard/dashboard.page';
import { Route as EnvironmentsRouteImport } from '/imports/ui/pages/dashboard/environments/environments.page';
import { Route as EnvironmentEditRouteImport } from '/imports/ui/pages/dashboard/environments/environment/environment.edit';
import { Route as EnvironmentPreviewRouteImport } from '/imports/ui/pages/dashboard/environments/environment/preview/environment.preview';
import { Route as UserLogsRouteImport } from '/imports/ui/pages/dashboard/userLogs/userLogs.page';

/**
 * Creates or updates a route using the provided route import, path, and parent route.
 *
 * @param RouteImport - The route import object to be updated.
 * @param path - The path identifier for the route, based on TRouterTypes.
 * @param parentRoute - The parent route to associate with the new route. Defaults to AdminRouteImport.
 * @returns The updated route object.
 */
function createRoute(
  RouteImport: any,
  path: TRouterTypes,
  parentRoute: RootRoute = AdminRouteImport,
): Route {
  return RouteImport.update({
    id: path,
    path,
    getParentRoute: () => parentRoute,
  } as any);
}

export const SigninRouteImport = createFileRoute(TRouterTypes.SIGNIN)({
  component: SignIn,
});

const SigninRoute = createRoute(SigninRouteImport, TRouterTypes.SIGNIN);
const SignupRoute = createRoute(SignupRouteImport, TRouterTypes.SIGNUP);

const DashboardRoute = createRoute(
  DashboardRouteImport,
  TRouterTypes.DASHBOARD,
);

const DashboardEnvironmentsRoute = createRoute(
  EnvironmentsRouteImport,
  TRouterTypes.DASHBOARD_ENVIRONMENTS,
);

const DashboardEnvironmentEditRoute = createRoute(
  EnvironmentEditRouteImport,
  TRouterTypes.DASHBOARD_ENVIRONMENT_EDIT,
);

const DashboardEnvironmentPreviewRoute = createRoute(
  EnvironmentPreviewRouteImport,
  TRouterTypes.DASHBOARD_ENVIRONMENT_PREVIEW,
);

const UserLogsRoute = createRoute(
  UserLogsRouteImport,
  TRouterTypes.DASHBOARD_USER_LOGS,
);

// Populate the FileRoutesByPath interface
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    [TRouterTypes.SIGNIN]: {
      preLoaderRoute: typeof SigninRouteImport;
      parentRoute: typeof PublicRouteImport;
    };
    [TRouterTypes.SIGNUP]: {
      preLoaderRoute: typeof SignupRouteImport;
      parentRoute: typeof PublicRouteImport;
    };
    [TRouterTypes.DASHBOARD]: {
      preLoaderRoute: typeof DashboardRouteImport;
      parentRoute: typeof AdminRouteImport;
    };
    [TRouterTypes.DASHBOARD]: {
      preLoaderRoute: typeof DashboardRouteImport;
      parentRoute: typeof AdminRouteImport;
    };
    [TRouterTypes.DASHBOARD]: {
      preLoaderRoute: typeof DashboardRouteImport;
      parentRoute: typeof AdminRouteImport;
    };
    [TRouterTypes.DASHBOARD]: {
      preLoaderRoute: typeof DashboardRouteImport;
      parentRoute: typeof AdminRouteImport;
    };
    [TRouterTypes.DASHBOARD_ENVIRONMENTS]: {
      preLoaderRoute: typeof EnvironmentsRouteImport;
      parentRoute: typeof AdminRouteImport;
    };
    [TRouterTypes.DASHBOARD_ENVIRONMENT_EDIT]: {
      preLoaderRoute: typeof DashboardEnvironmentEditRoute;
      parentRoute: typeof AdminRouteImport;
    };
    [TRouterTypes.DASHBOARD_ENVIRONMENT_PREVIEW]: {
      preLoaderRoute: typeof DashboardEnvironmentPreviewRoute;
      parentRoute: typeof AdminRouteImport;
    };
    [TRouterTypes.DASHBOARD_USER_LOGS]: {
      preLoaderRoute: typeof UserLogsRouteImport;
      parentRoute: typeof AdminRouteImport;
    };
  }
}

// Create and export the route tree
export const adminRouteTree = AdminRouteImport.addChildren([
  SignupRoute,
  SigninRoute,
  DashboardRoute,
  DashboardEnvironmentsRoute,
  DashboardEnvironmentEditRoute,
  DashboardEnvironmentPreviewRoute,
  UserLogsRoute,
]);

export const publicRouteTree = PublicRouteImport.addChildren([
  SignupRoute,
  SigninRoute,
]);
