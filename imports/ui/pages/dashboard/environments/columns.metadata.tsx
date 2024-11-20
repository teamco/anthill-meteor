import React from "react";
import { TableProps } from "antd/es/table";
import { CommonDataType, IMetadata, TLayout, TStatus } from "/imports/config/types";
import { indexColumn } from "/imports/utils/antd.utils";
import { tsToLocaleDateTime } from "/imports/utils/timestamp";
import { DataType } from "./environments.page";

/**
 * Returns columns for a table listing environments, including name, type, status, and last updated at.
 *
 * @returns {TableProps<DataType>['columns']} The columns
 */
export const metadataColumns = (): TableProps<DataType>['columns'] => {
  const columns: TableProps<DataType>['columns'] = [
    indexColumn,
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
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