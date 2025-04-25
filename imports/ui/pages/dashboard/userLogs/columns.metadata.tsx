import React, { JSX } from "react";
import { TableProps } from "antd/es/table";
import { Link } from "@tanstack/react-router";

import { IDataType } from "./userLogs.page";

import { IMetadata, TColumns } from "/imports/config/types";

import { indexColumn } from "/imports/utils/table/table.util";
import { tsToLocaleDateTime } from "/imports/utils/timestamp.util";
import { columnSorter } from "/imports/utils/table/sorter.util";
import { TFilters, TSorts } from "/imports/ui/hooks/table.hook";
import { columnFilter } from "/imports/utils/table/filter.util";
import { t, TIntl } from "/imports/utils/i18n.util";

type TArgs = {
  intl: TIntl;
  sortedInfo: TSorts,
  filteredInfo: TFilters;
  entities: IDataType[];
}

/**
 * Generates a column configuration for the widgets table.
 *
 * @param {{ intl: TIntl, filteredInfo: TFilters, sortedInfo: TSorts, entities: IDataType[] }} props - The props object
 * @returns {TableProps<IDataType>['columns']} A column configuration for the table.
 */
export const metadataColumns = ({ intl, filteredInfo, sortedInfo, entities }: TArgs): TableProps<IDataType>['columns'] => {
  const columns: TColumns<IDataType> = [
    indexColumn,
    {
      title: t(intl, 'logs.pathname'),
      dataIndex: 'location',
      key: 'location.pathname',
      ...columnSorter(sortedInfo, 'location.pathname', 'location'),
      render: ({ pathname }): JSX.Element => (
        <Link to={pathname}>{pathname}</Link>
      )
    },
    {
      title: t(intl, 'logs.navType'),
      dataIndex: 'navType',
      key: 'navType',
      width: 120,
      ...columnFilter(filteredInfo, entities, 'navType'),
      ...columnSorter(sortedInfo, 'navType'),
    },
    {
      title: t(intl, 'message.info.updatedAt'),
      width: 200,
      dataIndex: 'metadata',
      key: 'metadata.updatedAt',
      ...columnSorter(sortedInfo, 'metadata.updatedAt', 'metadata'),
      render: ({ updatedAt }: IMetadata): string => tsToLocaleDateTime(updatedAt.toString())
    },
  ];

  return columns;
}