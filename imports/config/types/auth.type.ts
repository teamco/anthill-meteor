export enum AuthStatus {
  LoggedOut = 'loggedOut',
  LoggedIn = 'loggedIn',
}

export type TAuth = {
  login: (username: string) => void;
  logout: () => void;
  status: AuthStatus.LoggedIn | AuthStatus.LoggedOut;
  username?: string;
};

export const auth: TAuth = {
  status: AuthStatus.LoggedOut,
  username: undefined,
  login: (username: string) => {
    auth.status = AuthStatus.LoggedIn;
    auth.username = username;
  },
  logout: () => {
    auth.status = AuthStatus.LoggedOut;
    auth.username = undefined;
  },
};
