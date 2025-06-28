import { Meteor } from 'meteor/meteor';
import { TTimestamp } from './common.type';

export interface IUser extends TTimestamp {
  _id: string;
  username?: string;
  services?: {
    password?: {
      bcrypt?: string;
    };
  };
}

export interface IUserProfile extends Meteor.User {
  profile: {
    name: string;
    picture: string;
  };
}
