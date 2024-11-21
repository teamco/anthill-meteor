import React from "react";
import { TableProps } from "antd/es/table";

import { DataType } from "./environments.page";

import { IMetadata, TColumns, TStatus } from "/imports/config/types";

import { indexColumn } from "/imports/utils/antd.util";
import { tsToLocaleDateTime } from "/imports/utils/timestamp.util";
import { columnSorter, Sorter } from "/imports/utils/sorter.util";
import { TFilters, TSorts } from "/imports/ui/hooks/table.hook";
import { columnFilter, getFilters } from "/imports/utils/filter.util";


/**
 * Generates table columns for the metadata table.
 * @param {TFilters} filteredInfo Filters for each column.
 * @param {TSorts} sortedInfo Sorted info for the table.
 * @param {DataType[]} entities Data to be filtered and sorted.
 * @returns {TColumns<DataType>} Table columns.
 */
export const metadataColumns = (filteredInfo: TFilters, sortedInfo: TSorts, entities: DataType[]): TableProps<DataType>['columns'] => {
  const columns: TColumns<DataType> = [
    indexColumn,
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...columnFilter(filteredInfo, entities, 'name'),
      ...columnSorter(sortedInfo, 'name'),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      ...columnFilter(filteredInfo, entities, 'type'),
      ...columnSorter(sortedInfo, 'type'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: TStatus): JSX.Element => {
        return (
          <div>
            {status.isDraft && 'Draft'}
            {status.isActive && 'Active'}
            {status.isPending && 'Pending'}
          </div>
        )
      }
    },
    {
      title: 'Updated At',
      dataIndex: ['metadata', 'updatedAt'],
      key: 'metadata.updatedAt',
      ...columnSorter(sortedInfo, 'metadata.createdAt', 'metadata'),
      render: (updatedAt: IMetadata['updatedAt']): JSX.Element => {
        return (
          <div>
            {tsToLocaleDateTime(updatedAt.toString())}
          </div>
        )
      }
    },
  ];

  return columns;
}