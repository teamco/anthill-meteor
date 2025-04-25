import { RootRoute, Route } from '@tanstack/react-router';
import { TRouterTypes } from '/imports/config/types';

import { Route as AdminRouteImport } from './__adminRoot';
import { Route as DashboardRouteImport } from '/imports/ui/pages/dashboard/dashboard.page';
import { Route as EnvironmentsPageRouteImport } from '/imports/ui/pages/dashboard/environments/environments.page';

/**
 * Creates or updates a route using the provided route import, path, and parent route.
 *
 * @param RouteImport - The route import object to be updated.
 * @param path - The path identifier for the route, based on TRouterTypes.
 * @param parentRoute - The parent route to associate with the new route. Defaults to AdminRouteImport.
 * @returns The updated route object.
 */
function createRoute(RouteImport: any, path: TRouterTypes, parentRoute: RootRoute = AdminRouteImport): Route {
  return RouteImport.update({
    id: path,
    path,
    getParentRoute: () => parentRoute,
  } as any);
}

// Create/Update Routes
const DashboardRoute = createRoute(DashboardRouteImport, TRouterTypes.DASHBOARD);
const DashboardEnvironmentsRoute = createRoute(EnvironmentsPageRouteImport, TRouterTypes.DASHBOARD_ENVIRONMENTS);

// Populate the FileRoutesByPath interface
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    [TRouterTypes.DASHBOARD]: {
      preLoaderRoute: typeof DashboardRouteImport;
      parentRoute: typeof AdminRouteImport;
    };
    [TRouterTypes.DASHBOARD_ENVIRONMENTS]: {
      preLoaderRoute: typeof EnvironmentsPageRouteImport;
      parentRoute: typeof AdminRouteImport;
    };
  }
}

// Create and export the route tree
export const routeTree = AdminRouteImport.addChildren([DashboardRoute, DashboardEnvironmentsRoute]);
