import { Meteor } from 'meteor/meteor';

import { TProviders } from '/server/types/provider.type';

const { clientId, secret } = Meteor.settings.private.google;

export type TGoogleProviderConfig = {
  clientId: string;
  secret: string;
  name: TProviders;
  loginStyle: string;
  requestPermissions: string[];
};

export const googleProviderConfig: TGoogleProviderConfig = {
  clientId,
  secret,
  name: TProviders.GOOGLE,
  loginStyle: 'popup',
  requestPermissions: ['email', 'profile'],
};
