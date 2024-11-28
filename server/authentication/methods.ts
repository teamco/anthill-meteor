import { Meteor } from "meteor/meteor";
import { HTTP } from 'meteor/http';
import { Accounts } from 'meteor/accounts-base';
import gravatar from 'gravatar';

import { IUser } from "/imports/config/types";

import './publish';

Meteor.methods({
  googleProfile: async ({ access_token }) => {
    const { data } = await HTTP.call('GET', 'https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { 'User-Agent': 'Meteor/3.0' },
      params: { access_token }
    });

    if (data?.email) {

      const user: IUser = await Accounts.findUserByEmail(data?.email);

      if (!user) {
        Accounts.createUserAsync({
          email: data?.email,
          profile: {
            provider: 'google',
            name: data?.name,
            locale: data?.locale,
            picture: data?.picture,
            email_verified: data?.email_verified
          }
        });
      }
    }
  },

  passwordProfile: async (data) => {
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