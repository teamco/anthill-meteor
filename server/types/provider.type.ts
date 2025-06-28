export enum EProviders {
  GOOGLE = 'google',
  GITHUB = 'github',
  PASSWORD = 'password',
}

export type TProvidersType = {
  GOOGLE: EProviders.GOOGLE;
  GITHUB: EProviders.GITHUB;
  PASSWORD: EProviders.PASSWORD;
} | null;
