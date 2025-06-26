import React, { useEffect, useState } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { IUser } from '/imports/config/types';

interface INavigateProps {
  adminRouter: any;
  publicRouter: any;
}

/**
 * This component is responsible for rendering the correct router based on user login status.
 * When the user is logged in, it renders the admin router, otherwise it renders the public router.
 * The component re-renders whenever the user logs in or out.
 */
export const Navigator: React.FC<INavigateProps> = (
  props,
): React.JSX.Element => {
  const { adminRouter, publicRouter } = props;

  const user = useTracker(() => Meteor.user()) as IUser;
  const [router, setRouter] = useState(publicRouter);

  useEffect(() => {
    if (user) {
      setRouter(adminRouter);
    } else {
      setRouter(publicRouter);
    }
  }, [user, router]);

  return <RouterProvider router={router} key={window.location.pathname} />;
};
