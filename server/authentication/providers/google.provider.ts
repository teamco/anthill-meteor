import { Meteor } from 'meteor/meteor';

import { EProviders } from '/server/types/provider.type';

const { clientId, secret } = Meteor.settings.private.google;

export type TGoogleProviderConfig = {
  clientId: string;
  secret: string;
  name: EProviders.GOOGLE;
  loginStyle: string;
  requestPermissions: string[];
};

export const googleProviderConfig: TGoogleProviderConfig = {
  clientId,
  secret,
  name: EProviders.GOOGLE,
  loginStyle: 'popup',
  requestPermissions: ['email', 'profile'],
};
