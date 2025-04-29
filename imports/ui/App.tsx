import React, { FC, JSX, SetStateAction, useState } from "react";
import dayjs from "dayjs";

import { Locale } from "antd/es/locale";

import enUs from "antd/locale/en_US";
// ... more locales

import "dayjs/locale/en";

import { IntlProvider } from "react-intl";
import { localeData } from "/imports/locales";

import "@ant-design/v5-patch-for-react-19";

/**
 * App component.
 *
 * @returns {JSX.Element} The App component.
 */
const App: FC<{ children: JSX.Element[] }> = ({ children }): JSX.Element => {
  const [locale, setLocal] = useState(enUs);

  const changeLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const localeValue = e.target.value;
    setLocal(localeValue as unknown as SetStateAction<Locale>);
    if (!localeValue) {
      dayjs.locale("en");
    } else {
      //dayjs.locale('zh-cn');
    }
  };

  const intlLocale = locale === enUs ? "en-US" : "zh-CN";

  return (
    <IntlProvider locale={intlLocale} messages={localeData[intlLocale]}>
      {children}
    </IntlProvider>
  );
};

export default App;
