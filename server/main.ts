import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { IUser } from '/imports/api/environment/types';

import './environments/methods';
import './environments/publish';

const SEED_USERNAME = 'admin';
const SEED_PASSWORD = 'password';

Meteor.startup(async () => {
  const user: IUser = await Accounts.findUserByUsername(SEED_USERNAME);

  if (!user) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }
});