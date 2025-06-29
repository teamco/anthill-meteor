import { RootRoute, Route } from '@tanstack/react-router';

import { TRouterTypes } from '/imports/config/types';

import { Route as SigninRouteImport } from '/imports/ui/pages/authentication/signin/signin';
import { Route as SignupRouteImport } from '/imports/ui/pages/authentication/signup/signup';

import { Route as AdminRouteImport } from './__root';
import { Route as PublicRouteImport } from './__publicRoot';

import { Route as DashboardRouteImport } from '/imports/ui/pages/dashboard/dashboard.page';
import { Route as WidgetsRouteImport } from '/imports/ui/pages/dashboard/widgets/widgets.page';
import { Route as EnvironmentsRouteImport } from '/imports/ui/pages/dashboard/environments/environments.page';
import { Route as EnvironmentEditRouteImport } from '/imports/ui/pages/dashboard/environments/environment/environment.edit';
import { Route as EnvironmentPreviewRouteImport } from '/imports/ui/pages/dashboard/environments/environment/preview/environment.preview';
import { Route as UserLogsRouteImport } from '/imports/ui/pages/dashboard/userLogs/userLogs.page';
import { Route as ProfileRouteImport } from '/imports/ui/pages/profile/profile.page';

import { Route as Error404RouteImport } from '/imports/ui/pages/404';

/**
 * Creates or updates a route using the provided route import, path, and
 * parent route.
 *
 * @param RouteImport - The route import object to be updated.
 * @param path - The path identifier for the route, based on TRouterTypes.
 * @param parentRoute - The parent route to associate with the new route.
 * Defaults to AdminRouteImport.
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

export const SigninRoute = createRoute(SigninRouteImport, TRouterTypes.SIGNIN);
export const SignupRoute = createRoute(SignupRouteImport, TRouterTypes.SIGNUP);

export const Error404Route = createRoute(
  Error404RouteImport,
  TRouterTypes.ERROR_404,
);

export const DashboardRoute = createRoute(
  DashboardRouteImport,
  TRouterTypes.DASHBOARD,
);

export const DashboardEnvironmentsRoute = createRoute(
  EnvironmentsRouteImport,
  TRouterTypes.DASHBOARD_ENVIRONMENTS,
);

export const DashboardWidgetsRoute = createRoute(
  WidgetsRouteImport,
  TRouterTypes.DASHBOARD_WIDGETS,
);

export const DashboardEnvironmentEditRoute = createRoute(
  EnvironmentEditRouteImport,
  TRouterTypes.DASHBOARD_ENVIRONMENT_EDIT,
);

const DashboardEnvironmentPreviewRoute = createRoute(
  EnvironmentPreviewRouteImport,
  TRouterTypes.DASHBOARD_ENVIRONMENT_PREVIEW,
);

export const UserLogsRoute = createRoute(
  UserLogsRouteImport,
  TRouterTypes.DASHBOARD_USER_LOGS,
);

export const ProfileRoute = createRoute(
  ProfileRouteImport,
  TRouterTypes.PROFILE,
);

// Create and export the route tree
export const adminRouteTree = AdminRouteImport.addChildren([
  Error404Route,
  SigninRoute,
  DashboardRoute,
  DashboardWidgetsRoute,
  DashboardEnvironmentsRoute,
  DashboardEnvironmentEditRoute,
  DashboardEnvironmentPreviewRoute,
  UserLogsRoute,
  ProfileRoute,
]);

export const publicRouteTree = PublicRouteImport.addChildren([
  Error404Route,
  SignupRoute,
  SigninRoute,
]);

export const error404RouteImport = Error404RouteImport;
export const adminRouteImport = AdminRouteImport;
export const publicRouteImport = PublicRouteImport;
export const signupRouteImport = SignupRouteImport;
export const signinRouteImport = SigninRouteImport;
export const dashboardRouteImport = DashboardRouteImport;
export const widgetsRouteImport = WidgetsRouteImport;
export const environmentsRouteImport = EnvironmentsRouteImport;
export const environmentEditRouteImport = EnvironmentEditRouteImport;
export const environmentPreviewRouteImport = EnvironmentPreviewRouteImport;
export const userLogsRouteImport = UserLogsRouteImport;
export const profileRouteImport = ProfileRouteImport;
