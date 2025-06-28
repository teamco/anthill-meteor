import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import gravatar from 'gravatar';

import { IUser, IUserProfile } from '/imports/config/types';

import { EProviders } from '../types/provider.type';

import './publish';
import './create';

Meteor.methods({
  /**
   * Creates a user profile with a password provider
   * @param data - Object with properties: email, password, name
   * @throws Meteor.Error with reason 'email-exists' if email already exists
   */
  passwordProfile: async (data): Promise<void> => {
    const user = (await Accounts.findUserByEmail(data?.email)) as
      | Meteor.User
      | undefined;

    if (user) {
      throw new Meteor.Error('email-exists', 'Email already exists');
    }

    const photoUrl = gravatar.url(data?.email);

    const profile = {
      provider: EProviders.PASSWORD,
      name: data?.name,
      email: data?.email,
      verified_email: false,
      picture: photoUrl,
      createdAt: new Date(),
    } as IUserProfile['profile'];

    profile.updatedAt = profile.createdAt;

    Accounts.createUserAsync({
      email: data?.email,
      password: data?.password,
      profile,
    });
  },
});
