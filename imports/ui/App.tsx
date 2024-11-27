import React, { FC, SetStateAction, useMemo, useState } from 'react';
import { RouterProvider } from "react-router-dom";
import dayjs from 'dayjs';

import { Locale } from 'antd/es/locale';

import enUs from 'antd/locale/en_US';
// ... more locales

import 'dayjs/locale/en';

import { renderRoutes } from '/imports/config/router';
import { IntlProvider } from 'react-intl';
import { localeData } from '/imports/locales';


/**
 * App component.
 *
 * It renders the react-router-dom router and the locale data by antd.
 *
 * @returns {JSX.Element} The App component.
 */
const App: FC = (): JSX.Element => {
  const router = useMemo(() => renderRoutes(), []);

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

  return (
    <IntlProvider locale={intlLocale} messages={localeData[intlLocale]}>
      <RouterProvider router={router} future={{
        v7_startTransition: true
      }} />
    </IntlProvider>
  )
};

export default App;