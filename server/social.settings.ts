import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

import { googleProviderConfig } from './authentication/providers/google.provider';

const providers = [
  googleProviderConfig,
  // Add other providers here if needed
];

Meteor.startup(async () => {
  for (const provider of providers) {
    if (provider.clientId && provider.secret) {
      await ServiceConfiguration.configurations.upsertAsync(
        { service: provider.name },
        {
          $set: {
            loginStyle: provider.loginStyle,
            clientId: provider.clientId,
            secret: provider.secret,
            requestPermissions: provider.requestPermissions,
          },
        },
      );
    } else {
      console.warn(
        `OAuth provider ${provider.name} is missing clientId or secret.`,
      );
    }
  }
});
