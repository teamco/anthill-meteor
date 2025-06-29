import React from 'react';
import { SorterResult, TablePaginationConfig } from 'antd/es/table/interface';
import { GetProp, TableProps } from 'antd/lib';

export interface ITableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<unknown>['field'];
  sortOrder?: SorterResult<unknown>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

export type TPaginateProps = {
  current: number;
  pageSize: number;
  sort?: [string[] | string, 'descend' | 'ascend'];
  filter?: [string[] | string, string[] | string];
  owner?: string;
};

export type TColumns<T extends object = object> = TableProps<T>['columns'];
export type TTablePaginationConfig = Exclude<
  GetProp<TableProps, 'pagination'>,
  boolean
>;

export type TSplitterLayout = 'horizontal' | 'vertical' | undefined;
export type TSplitterItem = {
  uuid: string;
  parentId?: string;
  size?: number | string;
};
export type TSplitter = {
  uuid?: string;
  parentId?: string;
  items?: TSplitterItem[];
  layout?: TSplitterLayout;
  size?: number | string;
  widget?: string;
};

export type TDirection = 'up' | 'down' | 'left' | 'right';
export type TAddPanelFn = (direction: TDirection, uuid: string) => void;
