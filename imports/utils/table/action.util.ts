import { t, TIntl } from '/imports/utils/i18n.util';

export const actionField = (intl: TIntl, width: number = 100) => {
  return {
    title: t(intl, 'table.actions'),
    key: 'operation',
    fixed: 'right',
    align: 'center',
    width,
  };
};
