import { JSX } from 'react';
import { TableProps } from 'antd/es/table';
import { Tag } from 'antd';

import { IDataType } from '../../environments.page';

import { IMetadata, TColumns, TWidget } from '/imports/config/types';

import { indexColumn } from '/imports/utils/table/table.util';
import { tsToLocaleDateTime } from '/imports/utils/timestamp.util';
import { columnSorter } from '/imports/utils/table/sorter.util';
import { TSorts } from '/imports/ui/hooks/table.hook';
import { t, TIntl } from '/imports/utils/i18n.util';
import { actionField } from '/imports/utils/table/action.util';

import { DeleteAction } from '/imports/ui/components/Actions/delete.action';
import { VersionAction } from '/imports/ui/components/Actions/version.action';

type TArgs = {
  intl: TIntl;
  sortedInfo: TSorts;
  onDelete: (id: string) => void;
};

/**
 * Generates a column configuration for the metadata table.
 *
 * @param {{ intl: TIntl, sortedInfo: TSorts, onDelete: (id: string) => void }} props - The props object
 * @returns {TableProps<IDataType>['columns']} A column configuration for the metadata table
 */
export const metadataColumns = ({
  intl,
  sortedInfo,
  onDelete,
}: TArgs): TableProps<IDataType>['columns'] => {
  const columns: TColumns<IDataType> = [
    indexColumn,
    {
      title: t(intl, 'environment.list.layout.version'),
      dataIndex: 'version',
      key: 'version',
      width: 100,
      align: 'center',
      ...columnSorter(sortedInfo, 'version'),
    },
    {
      title: t(intl, 'environment.list.layout.screenshot'),
      dataIndex: 'screenshot',
      key: 'screenshot',
      align: 'center',
    },
    {
      title: t(intl, 'environment.list.widgets'),
      dataIndex: 'widgets',
      key: 'widgets',
      render(widgets: TWidget[]): JSX.Element {
        return (
          <div>
            {Object.keys(widgets).map((widget, idx) => (
              <Tag key={idx}>{widgets[widget].name}</Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: t(intl, 'message.info.updatedAt'),
      width: 200,
      dataIndex: 'metadata',
      key: 'metadata.updatedAt',
      ...columnSorter(sortedInfo, 'metadata.createdAt', 'metadata'),
      render: ({ updatedAt }: IMetadata): JSX.Element => {
        return <div>{tsToLocaleDateTime(updatedAt.toString())}</div>;
      },
    },
    {
      ...actionField(intl),
      render: (record: IDataType) => (
        <div className="eActions">
          <VersionAction
            type={'text'}
            version={record.version}
            entityId={record._id}
          />
          <DeleteAction
            onDelete={onDelete}
            type={'text'}
            entityId={record._id}
            modalMsg={t(intl, 'environment.layout')}
          />
        </div>
      ),
    },
  ];

  return columns;
};
