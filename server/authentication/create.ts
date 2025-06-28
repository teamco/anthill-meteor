import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

import { IUserProfile, TProviders } from '/imports/config/types/user.type';
import { EProviders, TProvidersType } from '/server/types/provider.type';

Accounts.onCreateUser((options, user: Meteor.User) => {
  const services: Meteor.UserServices = user.services || {};
  const providerName = (Object.keys(services).shift() ||
    null) as keyof TProvidersType;

  if (!providerName) {
    throw new Meteor.Error('invalid-login', 'Invalid provider attempt');
  }

  const profile = {
    ...options?.profile,
    createdAt: new Date(user.createdAt || Date.now()),
  } as IUserProfile['profile'];

  if (providerName === EProviders.GOOGLE) {
    const provider = services[providerName] as TProviders['GOOGLE'];

    profile.provider = EProviders.GOOGLE;
    profile.name = provider.name;
    profile.picture = provider.picture;
    profile.email = provider.email;
    profile.verified_email = provider.verified_email;
  }

  profile.updatedAt = profile.createdAt;

  user.profile = profile;

  return user;
});
