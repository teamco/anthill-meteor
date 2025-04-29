import { Meteor } from "meteor/meteor";
import { HTTP } from 'meteor/http';
import { Accounts } from 'meteor/accounts-base';
import gravatar from 'gravatar';

import { IUser } from "/imports/config/types";

import './publish';

Meteor.methods({
  
  /**
   * Creates a user profile with a password provider
   * @param data - Object with properties: email, password, name
   * @throws Meteor.Error with reason 'email-exists' if email already exists
   */
  passwordProfile: async (data): Promise<void> => {
    const user: IUser = await Accounts.findUserByEmail(data?.email);

    if (user) {

      throw new Meteor.Error('email-exists', 'Email already exists');

    } else {

      const photoUrl = gravatar.url(data?.email);

      Accounts.createUserAsync({
        email: data?.email,
        password: data?.password,
        profile: {
          provider: 'password',
          name: data?.name,
          picture: photoUrl
        }
      });
    }
  },
});