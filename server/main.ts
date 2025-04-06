/**
 * These modules are automatically imported by jorgenvatle:vite.
 * You can commit these to your project or move them elsewhere if you'd like,
 * but they must be imported somewhere in your Meteor mainModule.
 *
 * More info: https://github.com/JorgenVatle/meteor-vite#lazy-loaded-meteor-packages
 **/
import "../_vite-bundle/server/_entry.mjs"
/** End of vite auto-imports **/
import { Meteor } from 'meteor/meteor';

import './environments/methods';
import './widgets/methods';
import './layouts/methods';
import './logs/errorLogs/methods';
import './logs/userLogs/methods';
import './authentication/methods';

import './social.settings';

require('dotenv').config();

type TProviders = 'google' | 'github';
const providers: TProviders[] = ['google', 'github'];
console.log(process.env);
Meteor.startup(async () => {
  for (const provider of providers) {
    console.log(`\nSetting up ${provider.toUpperCase()} OAuth configuration...`);
    console.log(`__${provider.toUpperCase()}_CLIENT_ID: ${process.env[`__${provider.toUpperCase()}_CLIENT_ID`]}\n`);
    
    ServiceConfiguration.configurations.upsertAsync(
      { service: provider },
      {
        $set: {
          loginStyle: 'popup',
          clientId: process.env[`__${provider.toUpperCase()}_CLIENT_ID`],
          secret: process.env[`__${provider.toUpperCase()}_SECRET_KEY`],
          requestPermissions: ['email', 'profile']
        }
      }
    );
  }
});
