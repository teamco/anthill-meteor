export enum TRouterTypes {
  ROOT = '/',
  ERROR_403 = '/errors/403',
  ERROR_404 = '/errors/404',
  ERROR_500 = '/errors/500',
  LOGOUT = '/logout',
  SIGNUP = '/signup',
  SIGNIN = '/signin',
  DASHBOARD = '/dashboard',
  DASHBOARD_ENVIRONMENTS = '/dashboard/environments',
  DASHBOARD_ENVIRONMENT_EDIT = '/dashboard/environments/$environmentId',
  DASHBOARD_ENVIRONMENT_PREVIEW = '/dashboard/environments/$environmentId/version/$versionId',
  DASHBOARD_WIDGETS = '/dashboard/widgets',
  DASHBOARD_LAYOUTS = '/dashboard/layouts',
  DASHBOARD_USER_LOGS = '/dashboard/userLogs',
  PROFILE = '/profile',
}

export type TRouterType = keyof typeof TRouterTypes;

export type TRouterParams = {
  environmentId?: string;
  versionId?: string;
};
