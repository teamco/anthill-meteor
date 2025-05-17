import { createContext } from 'react';

import { TIntl } from '/imports/utils/i18n.util';

export const I18nContext = createContext({ intl: null } as unknown as TIntl);
