import React from "react";
import { TableProps } from "antd/es/table";

import { DataType } from "./environments.page";

import { IMetadata, TColumns, TStatus } from "/imports/config/types";

import { indexColumn } from "/imports/utils/antd.util";
import { tsToLocaleDateTime } from "/imports/utils/timestamp.util";

/**
 * Returns columns for a table listing environments, including name, type, status, and last updated at.
 *
 * @returns {TableProps<DataType>['columns']} The columns
 */
export const metadataColumns = (): TableProps<DataType>['columns'] => {
  const columns: TColumns<DataType> = [
    indexColumn,
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      sorter: true
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
      dataIndex: 'metadata',
      key: 'metadata',
      sorter: true,
      render: (metadata: IMetadata): JSX.Element => {
        return (
          <div>
            {tsToLocaleDateTime(metadata?.updatedAt.toString())}
          </div>
        )
      }
    },
  ];

  return columns;
}