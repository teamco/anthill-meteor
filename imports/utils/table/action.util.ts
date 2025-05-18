import { ColumnType } from 'antd/es/table';
import { t, TIntl } from '/imports/utils/i18n.util';

export const actionField = (
  intl: TIntl,
  width: number = 100,
): Partial<ColumnType> => {
  return {
    title: t(intl, 'table.actions'),
    key: 'operation',
    fixed: 'right',
    align: 'center',
    width,
  };
};
