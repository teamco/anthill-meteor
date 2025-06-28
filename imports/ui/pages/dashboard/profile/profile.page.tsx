import React, { useContext } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import Page from '/imports/ui/components/Page/page.component';

import { htmlT, t } from '/imports/utils/i18n.util';
import { I18nContext } from '/imports/ui/context/i18n.context';
import { IUserProfile, TRouterTypes } from '/imports/config/types';
import { createFileRoute } from '@tanstack/react-router';

const UserProfilePage: React.FC = () => {
  const user: IUserProfile = useTracker(() => Meteor.user()) as IUserProfile;

  const intl = useContext(I18nContext);

  return (
    <Page
      raiseOn404={!user}
      ableFor={{ subject: user?._id.toString() || '' }}
      loading={!user}
      title={t(intl, 'profile.welcome', {
        name: user?.profile?.name,
        span: htmlT('span'),
        p: htmlT('p'),
      })}
    >
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h2>Profile</h2>
        <div>
          <strong>Name:</strong>{' '}
          {user?.profile?.name || user?.username || 'N/A'}
        </div>
        <div>
          <strong>Email:</strong> {user?.emails?.[0]?.address || 'N/A'}
        </div>
        {/* Add more user fields as needed */}
      </div>
    </Page>
  );
};

export const Route = createFileRoute(TRouterTypes.DASHBOARD_PROFILE)({
  component: UserProfilePage,
});
