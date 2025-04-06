import React, { JSX } from "react";
import { TableProps } from "antd/es/table";
import { Tag, Tooltip } from "antd";
import { QuestionCircleTwoTone } from "@ant-design/icons";

import { IDataType } from "./widgets.page";

import { IMetadata, TColumns } from "/imports/config/types";

import { indexColumn } from "/imports/utils/antd.util";
import { tsToLocaleDateTime } from "/imports/utils/timestamp.util";
import { columnSorter } from "/imports/utils/table/sorter.util";
import { TFilters, TSorts } from "/imports/ui/hooks/table.hook";
import { columnFilter } from "/imports/utils/table/filter.util";
import { t, TIntl } from "/imports/utils/i18n.util";
import { actionField } from "/imports/utils/table/action.util";

import { DeleteAction } from "/imports/ui/components/Actions/delete.action";
import { EditAction } from "/imports/ui/components/Actions/edit.action";

type TArgs = {
  intl: TIntl;
  sortedInfo: TSorts;
  filteredInfo: TFilters;
  entities: IDataType[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAssign?: (id: string) => void;
  onUnAssign?: (id: string) => void;
};

/**
 * Generates a column configuration for the widgets table.
 *
 * @param {{ intl: TIntl, filteredInfo: TFilters, sortedInfo: TSorts, onDelete: (id: string) => void, onEdit: (id: string) => void, entities: IDataType[] }} props - The props object
 * @returns {TableProps<IDataType>['columns']} A column configuration for the table.
 */
export const metadataColumns = ({
  intl,
  filteredInfo,
  sortedInfo,
  onDelete,
  onEdit,
  entities,
}: TArgs): TableProps<IDataType>["columns"] => {
  const actionsColumn =
    onEdit || onDelete
      ? {
          ...actionField(intl),
          render: (record: IDataType) => (
            <div>
              <EditAction onEdit={onEdit} type={"text"} entityId={record._id} />
              <DeleteAction
                onDelete={onDelete}
                type={"text"}
                entityId={record._id}
                modalMsg={t(intl, "environment.title")}
              />
            </div>
          ),
        }
      : {};

  const columns: TColumns<IDataType> = [
    indexColumn,
    {
      title: t(intl, "widget.list.image"),
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 80,
      align: "center",
      render(thumbnail: string, record: IDataType): JSX.Element {
        return (
          <div className="eThumbnail">
            <img src={thumbnail} alt={record.name} />
          </div>
        );
      },
    },
    {
      title: t(intl, "widget.list.name"),
      dataIndex: "name",
      key: "name",
      ...columnFilter(filteredInfo, entities, "name"),
      ...columnSorter(sortedInfo, "name"),
      render(name: string, record: IDataType): JSX.Element {
        return record?.description ? (
          <Tooltip title={record?.description}>
            <div className="eIconName">
              <QuestionCircleTwoTone />
              {name}
            </div>
          </Tooltip>
        ) : (
          <div>{name}</div>
        );
      },
    },
    {
      title: t(intl, "widget.list.category"),
      dataIndex: "category",
      key: "category",
      ...columnFilter(filteredInfo, entities, "category"),
      ...columnSorter(sortedInfo, "category"),
      render: (category: string): JSX.Element => (
        <Tag>{category.toUpperCase()}</Tag>
      ),
    },
    {
      title: t(intl, "widget.list.size"),
      dataIndex: "dimensions",
      key: "dimensions",
      width: 100,
      align: "center",
      render: ({ width, height }): JSX.Element => (
        <>
          {width}x{height}
        </>
      ),
    },
    {
      title: t(intl, "widget.list.type"),
      width: 100,
      dataIndex: "content",
      key: "content.type",
      ...columnSorter(sortedInfo, "content.type", "content"),
      render: ({ type }): string => type,
    },
    {
      title: t(intl, "message.info.updatedAt"),
      width: 200,
      dataIndex: "metadata",
      key: "metadata.updatedAt",
      ...columnSorter(sortedInfo, "metadata.updatedAt", "metadata"),
      render: ({ updatedAt }: IMetadata): string =>
        tsToLocaleDateTime(updatedAt.toString()),
    },
    actionsColumn,
  ];

  return columns;
};
