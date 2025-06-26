import { Meteor } from 'meteor/meteor';

import './environments/methods';
import './widgets/methods';
import './layouts/methods';
import './logs/errorLogs/methods';
import './logs/userLogs/methods';
import './authentication/methods';

import './social.settings';

type TProviders = 'google' | 'github';
const providers: TProviders[] = ['google', 'github'];

Meteor.startup(async () => {
  // for (const provider of providers) {
  //   console.log(`\nSetting up ${provider.toUpperCase()} OAuth configuration...`);
  //   console.log(`__${provider.toUpperCase()}_CLIENT_ID: ${process.env[`__${provider.toUpperCase()}_CLIENT_ID`]}\n`);
  //
  //   ServiceConfiguration.configurations.upsertAsync(
  //     { service: provider },
  //     {
  //       $set: {
  //         loginStyle: 'popup',
  //         clientId: process.env[`__${provider.toUpperCase()}_CLIENT_ID`],
  //         secret: process.env[`__${provider.toUpperCase()}_SECRET_KEY`],
  //         requestPermissions: ['email', 'profile']
  //       }
  //     }
  //   );
  // }
});
