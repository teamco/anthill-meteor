import React, { FC, JSX, useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { AbilityContext, AuthenticationContext } from '/imports/ui/context/authentication.context';

import { defineAbilityFor } from '/imports/ui/services/ability.service';

type TProps = {
  children: string | JSX.Element | JSX.Element[]
}

/**
 * @description The auth layout for the admin pages
 * @returns {JSX.Element} The auth layout for the admin pages
 */
const AuthLayout: FC<TProps> = ({ children }): JSX.Element => {
  const [ability, setAbility] = useState(defineAbilityFor(Meteor.user()));

  const user = useTracker(() => Meteor.user());

  useEffect(() => {
    user?._id && setAbility(defineAbilityFor(user));
  }, [user?._id]);

  return (
    <AuthenticationContext.Provider value={user}>
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    </AuthenticationContext.Provider>
  );
};

export default AuthLayout;
