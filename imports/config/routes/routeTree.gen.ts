import { TRouterTypes } from '/imports/config/types';

import {
  adminRouteImport,
  dashboardRouteImport,
  environmentEditRouteImport,
  environmentPreviewRouteImport,
  environmentsRouteImport,
  error404RouteImport,
  profileRouteImport,
  publicRouteImport,
  signinRouteImport,
  signupRouteImport,
  userLogsRouteImport,
  widgetsRouteImport,
} from './routeConfig';

// Populate the FileRoutesByPath interface
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    [TRouterTypes.ERROR_404]: {
      preLoaderRoute: typeof error404RouteImport;
      parentRoute: typeof publicRouteImport | typeof adminRouteImport;
    };
    [TRouterTypes.SIGNIN]: {
      preLoaderRoute: typeof signinRouteImport;
      parentRoute: typeof publicRouteImport;
    };
    [TRouterTypes.SIGNUP]: {
      preLoaderRoute: typeof signupRouteImport;
      parentRoute: typeof publicRouteImport;
    };
    [TRouterTypes.DASHBOARD]: {
      preLoaderRoute: typeof dashboardRouteImport;
      parentRoute: typeof adminRouteImport;
    };
    [TRouterTypes.DASHBOARD_ENVIRONMENTS]: {
      preLoaderRoute: typeof environmentsRouteImport;
      parentRoute: typeof adminRouteImport;
    };
    [TRouterTypes.DASHBOARD_ENVIRONMENT_EDIT]: {
      preLoaderRoute: typeof environmentEditRouteImport;
      parentRoute: typeof adminRouteImport;
    };
    [TRouterTypes.DASHBOARD_ENVIRONMENT_PREVIEW]: {
      preLoaderRoute: typeof environmentPreviewRouteImport;
      parentRoute: typeof adminRouteImport;
    };
    [TRouterTypes.DASHBOARD_WIDGETS]: {
      preLoaderRoute: typeof widgetsRouteImport;
      parentRoute: typeof adminRouteImport;
    };
    [TRouterTypes.DASHBOARD_USER_LOGS]: {
      preLoaderRoute: typeof userLogsRouteImport;
      parentRoute: typeof adminRouteImport;
    };
    [TRouterTypes.DASHBOARD_PROFILE]: {
      preLoaderRoute: typeof profileRouteImport;
      parentRoute: typeof adminRouteImport;
    };
  }
}

export interface FileRoutesByFullPath {
  [TRouterTypes.DASHBOARD]: typeof adminRouteImport;
  [TRouterTypes.ERROR_404]: typeof error404RouteImport;
  [TRouterTypes.SIGNIN]: typeof signinRouteImport;
  [TRouterTypes.SIGNUP]: typeof signupRouteImport;
  [TRouterTypes.DASHBOARD_ENVIRONMENTS]: typeof environmentsRouteImport;
  [TRouterTypes.DASHBOARD_ENVIRONMENT_EDIT]: typeof environmentEditRouteImport;
  [TRouterTypes.DASHBOARD_ENVIRONMENT_PREVIEW]: typeof environmentPreviewRouteImport;
  [TRouterTypes.DASHBOARD_WIDGETS]: typeof widgetsRouteImport;
  [TRouterTypes.DASHBOARD_USER_LOGS]: typeof userLogsRouteImport;
  [TRouterTypes.DASHBOARD_PROFILE]: typeof profileRouteImport;
}

export interface FileRoutesByTo {
  [TRouterTypes.DASHBOARD]: typeof adminRouteImport;
  [TRouterTypes.ERROR_404]: typeof error404RouteImport;
  [TRouterTypes.SIGNIN]: typeof signinRouteImport;
  [TRouterTypes.SIGNUP]: typeof signupRouteImport;
  [TRouterTypes.DASHBOARD_ENVIRONMENTS]: typeof environmentsRouteImport;
  [TRouterTypes.DASHBOARD_ENVIRONMENT_EDIT]: typeof environmentEditRouteImport;
  [TRouterTypes.DASHBOARD_ENVIRONMENT_PREVIEW]: typeof environmentPreviewRouteImport;
  [TRouterTypes.DASHBOARD_WIDGETS]: typeof widgetsRouteImport;
  [TRouterTypes.DASHBOARD_USER_LOGS]: typeof userLogsRouteImport;
  [TRouterTypes.DASHBOARD_PROFILE]: typeof profileRouteImport;
}

export interface FileRoutesById {
  [TRouterTypes.DASHBOARD]: typeof adminRouteImport;
  [TRouterTypes.ERROR_404]: typeof error404RouteImport;
  [TRouterTypes.SIGNIN]: typeof signinRouteImport;
  [TRouterTypes.SIGNUP]: typeof signupRouteImport;
  [TRouterTypes.DASHBOARD_ENVIRONMENTS]: typeof environmentsRouteImport;
  [TRouterTypes.DASHBOARD_ENVIRONMENT_EDIT]: typeof environmentEditRouteImport;
  [TRouterTypes.DASHBOARD_ENVIRONMENT_PREVIEW]: typeof environmentPreviewRouteImport;
  [TRouterTypes.DASHBOARD_WIDGETS]: typeof widgetsRouteImport;
  [TRouterTypes.DASHBOARD_PROFILE]: typeof profileRouteImport;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: never;
  fileRoutesByTo: FileRoutesByTo;
  to: never;
  id: '__root__';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  [TRouterTypes.DASHBOARD]: typeof adminRouteImport;
  [TRouterTypes.ERROR_404]: typeof error404RouteImport;
  [TRouterTypes.SIGNIN]: typeof signinRouteImport;
  [TRouterTypes.SIGNUP]: typeof signupRouteImport;
  [TRouterTypes.DASHBOARD_ENVIRONMENTS]: typeof environmentsRouteImport;
  [TRouterTypes.DASHBOARD_ENVIRONMENT_EDIT]: typeof environmentEditRouteImport;
  [TRouterTypes.DASHBOARD_ENVIRONMENT_PREVIEW]: typeof environmentPreviewRouteImport;
  [TRouterTypes.DASHBOARD_WIDGETS]: typeof widgetsRouteImport;
  [TRouterTypes.DASHBOARD_USER_LOGS]: typeof userLogsRouteImport;
  [TRouterTypes.DASHBOARD_PROFILE]: typeof profileRouteImport;
}

export interface RootRoute {
  preLoaderRoute: typeof adminRouteImport;
  children: RootRouteChildren;
}

export const rootRoute: RootRoute = {
  preLoaderRoute: adminRouteImport,
  children: {
    [TRouterTypes.DASHBOARD]: adminRouteImport,
    [TRouterTypes.ERROR_404]: error404RouteImport,
    [TRouterTypes.SIGNIN]: signinRouteImport,
    [TRouterTypes.SIGNUP]: signupRouteImport,
    [TRouterTypes.DASHBOARD_ENVIRONMENTS]: environmentsRouteImport,
    [TRouterTypes.DASHBOARD_ENVIRONMENT_EDIT]: environmentEditRouteImport,
    [TRouterTypes.DASHBOARD_ENVIRONMENT_PREVIEW]: environmentPreviewRouteImport,
    [TRouterTypes.DASHBOARD_WIDGETS]: widgetsRouteImport,
    [TRouterTypes.DASHBOARD_USER_LOGS]: userLogsRouteImport,
    [TRouterTypes.DASHBOARD_PROFILE]: profileRouteImport,
  },
};
