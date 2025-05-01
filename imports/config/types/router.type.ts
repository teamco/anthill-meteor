export enum TRouterTypes {
  ROOT = '/',
  LOGOUT = '/logout',
  SIGNUP = '/signup',
  DASHBOARD = '/dashboard',
  DASHBOARD_ENVIRONMENTS = '/dashboard/environments',
  DASHBOARD_ENVIRONMENT_EDIT = '/dashboard/environments/$environmentId',
  DASHBOARD_ENVIRONMENT_PREVIEW = '/dashboard/environments/$environmentId/version/$versionId',
  DASHBOARD_WIDGETS = '/dashboard/widgets',
  DASHBOARD_LAYOUTS = '/dashboard/layouts',
  DASHBOARD_USER_LOGS = '/dashboard/userLogs',
}
