import { Meteor } from 'meteor/meteor';
import { TTimestamp } from './common.type';

export type TProviders = {
  GOOGLE: {
    id: string;
    email: string;
    accessToken: string;
    name: string;
    picture: string;
    verified_email: boolean;
  };
  PASSWORD: {
    bcrypt?: string;
  };
};

export interface IUser extends TTimestamp {
  _id: string;
  username?: string;
  services?: {
    password?: TProviders['PASSWORD'];
    google?: TProviders['GOOGLE'];
  };
}

export interface IUserProfile extends Meteor.User {
  profile: {
    provider: string;
    name: string;
    picture: string;
    email: string;
    verified_email: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
}
