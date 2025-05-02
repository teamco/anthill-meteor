import React, { FC, JSX, SetStateAction, useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { IntlProvider } from 'react-intl';
import dayjs from 'dayjs';

import { Locale } from 'antd/es/locale';

import enUs from 'antd/locale/en_US';
// ... more locales

import 'dayjs/locale/en';

import {
  AbilityContext,
  AuthenticationContext,
} from '/imports/ui/context/authentication.context';

import { defineAbilityFor } from '/imports/ui/services/ability.service';

import { localeData } from '/imports/locales';

type TProps = {
  children: string | JSX.Element | JSX.Element[];
};

/**
 * @description The auth layout for the admin pages
 * @returns {JSX.Element} The auth layout for the admin pages
 */
const AuthLayout: FC<TProps> = ({ children }): JSX.Element => {
  const [locale, setLocal] = useState(enUs);

  const changeLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const localeValue = e.target.value;
    setLocal(localeValue as unknown as SetStateAction<Locale>);
    if (!localeValue) {
      dayjs.locale('en');
    } else {
      //dayjs.locale('zh-cn');
    }
  };

  const intlLocale = locale === enUs ? 'en-US' : 'zh-CN';

  const [ability, setAbility] = useState(defineAbilityFor(Meteor.user()));

  const user = useTracker(() => Meteor.user());

  useEffect(() => {
    user?._id && setAbility(defineAbilityFor(user));
  }, [user?._id]);

  return (
    <IntlProvider locale={intlLocale} messages={localeData[intlLocale]}>
      <AuthenticationContext.Provider value={user}>
        <AbilityContext.Provider value={ability}>
          {children}
        </AbilityContext.Provider>
      </AuthenticationContext.Provider>
    </IntlProvider>
  );
};

export default AuthLayout;
