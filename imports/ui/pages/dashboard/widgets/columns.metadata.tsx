import React from "react";
import { TableProps } from "antd/es/table";
import { Tooltip } from "antd";
import { QuestionCircleTwoTone } from '@ant-design/icons';

import { DataType } from "./widgets.page";

import { IMetadata, TColumns, TStatus } from "/imports/config/types";

import { indexColumn } from "/imports/utils/antd.util";
import { tsToLocaleDateTime } from "/imports/utils/timestamp.util";
import { columnSorter } from "/imports/utils/table/sorter.util";
import { TFilters, TSorts } from "/imports/ui/hooks/table.hook";
import { columnFilter } from "/imports/utils/table/filter.util";
import { t, TIntl } from "/imports/utils/i18n.util";
import { actionField } from "/imports/utils/table/action.util";

import { DeleteAction } from "/imports/ui/components/Actions/delete.action";
import { EditAction } from "/imports/ui/components/Actions/edit.action";

/**
 * Generates a column configuration for the environments table.
 *
 * @param {TIntl} intl - The current i18n configuration.
 * @param {TFilters} filteredInfo - Contains the current filter information.
 * @param {TSorts} sortedInfo - Contains the current sort information.
 * @param {(id: string) => void} onDelete - The function to be called when the delete action is triggered.
 * @param {(id: string) => void} onEdit - The function to be called when the edit action is triggered.
 * @param {DataType[]} entities - The data source for the table.
 * @returns {TableProps<DataType>['columns']} A column configuration for the table.
 */
export const metadataColumns = (intl: TIntl, filteredInfo: TFilters, sortedInfo: TSorts, onDelete: (id: string) => void, onEdit: (id: string) => void, entities: DataType[]): TableProps<DataType>['columns'] => {
  const columns: TColumns<DataType> = [
    indexColumn,
    {
      title: t(intl, 'widget.list.image'),
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 80,
      align: 'center',
      render(thumbnail: string, record: DataType): JSX.Element {
        return (
          <div className="eThumbnail">
            <img src={thumbnail} alt={record.name} />
          </div>
        )
      }
    },
    {
      title: t(intl, 'widget.list.name'),
      dataIndex: 'name',
      key: 'name',
      ...columnFilter(filteredInfo, entities, 'name'),
      ...columnSorter(sortedInfo, 'name'),
      render(name: string, record: DataType): JSX.Element {
        return record?.description ? (
          <Tooltip title={record?.description}>
            <div className="eIconName">
              <QuestionCircleTwoTone />
              {name}
            </div>
          </Tooltip>
        ) : (
          <div>{name}</div>
        )
      }
    },
    {
      title: t(intl, 'widget.list.category'),
      dataIndex: 'category',
      key: 'category',
      ...columnFilter(filteredInfo, entities, 'category'),
      ...columnSorter(sortedInfo, 'category'),
    },
    {
      title: t(intl, 'widget.list.size'),
      dataIndex: 'dimensions',
      key: 'dimensions',
      width: 100,
      align: 'center',
      render: ({ width, height }): JSX.Element => (<>{width}x{height}</>)
    },
    {
      title: t(intl, 'widget.list.type'),
      width: 100,
      dataIndex: 'content',
      key: 'content.type',
      ...columnSorter(sortedInfo, 'content.type', 'content'),
      render: ({ type }): string => type
    },
    {
      title: t(intl, 'message.info.updatedAt'),
      width: 200,
      dataIndex: 'metadata',
      key: 'metadata.updatedAt',
      ...columnSorter(sortedInfo, 'metadata.updatedAt', 'metadata'),
      render: ({ updatedAt }: IMetadata): string => tsToLocaleDateTime(updatedAt.toString())
    },
    {
      ...actionField(intl),
      render: (record: DataType) => (
        <div>
          <EditAction
            onEdit={onEdit}
            type={'text'}
            entityId={record._id} />
          <DeleteAction
            onDelete={onDelete}
            type={'text'}
            entityId={record._id}
            modalMsg={t(intl, 'environment.title')} />
        </div>
      ),
    }
  ];

  return columns;
}