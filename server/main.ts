import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { IUser } from '/imports/config/types';

import './environments/methods';
import './widgets/methods';
import './layouts/methods';
import './logs/errorLogs/methods';
import './logs/userLogs/methods';
import './authentication/methods';  

import './social.settings';

Meteor.startup(async () => {
});