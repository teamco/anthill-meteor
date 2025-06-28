import React, { FC, JSX, useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { IntlProvider } from 'react-intl';

// ... more locales

import 'dayjs/locale/en';

import {
  AbilityContext,
  AuthenticationContext,
} from '../context/authentication.context';

import { defineAbilityFor } from '/imports/ui/services/ability.service';

import { localeData } from '/imports/locales';
import { Meteor } from 'meteor/meteor';
import { IUser } from '/imports/config/types';

type TProps = {
  children: string | JSX.Element | JSX.Element[];
};

/**
 * @description The auth layout for the admin pages
 * @returns {JSX.Element} The auth layout for the admin pages
 */
const AuthLayout: FC<TProps> = ({ children }): React.JSX.Element => {
  // const [locale, setLocal] = useState<Locale>(enUs);

  // const changeLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const localeValue = e.target.value;
  //   setLocal(localeValue as unknown as SetStateAction<Locale>);
  //   if (!localeValue) {
  //     dayjs.locale('en');
  //   } else {
  //     //dayjs.locale('zh-cn');
  //   }
  // };

  const intlLocale = 'en-US';
  // Only allow supported locales
  // const supportedLocales = Object.keys(localeData) as Array<'en-US' | 'zh-CN'>;
  // const selectedLocale = locale === enUs ? 'en-US' : 'zh-CN';
  // const intlLocale: 'en-US' | 'zh-CN' = supportedLocales.includes(
  //   selectedLocale,
  // )
  //   ? selectedLocale
  //   : 'en-US';

  const [ability, setAbility] = useState(
    defineAbilityFor(Meteor.user() as IUser),
  );

  const user = useTracker(() => Meteor.user()) as IUser;

  useEffect(() => {
    setAbility(defineAbilityFor(user));
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
