import { TablePaginationConfig, GetProp, TableProps } from "antd";
import { SorterResult } from "antd/es/table/interface";

export type TStatus = {
  isDraft: boolean;
  isActive: boolean;
  isPending: boolean;
  isOnHold: boolean;
}

export type TTimestamp = {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser extends TTimestamp {
  _id: string;
  username?: string;
  services?: {
    password?: {
      bcrypt?: string;
    };
  }
}

export interface IMetadata extends TTimestamp {
  createdBy: IUser['_id'];
  updatedBy: IUser['_id'];
}

export type TTemplate = {
  [key: string]: any
}

export type TLayout = {
  addWidget(widget: TWidget): void;
  removeWidget(widget: TWidget): void;
  template: TTemplate;
  current: boolean;
  version: number;
  metadata: IMetadata,
  widgets: TWidget[]
}

export type TEnvironment = {
  createLayout(user: IUser): TLayout;
  updateLayout(layout: TLayout): TLayout;
  assignedWidgets: TWidget[];
  _id?: string;
  name: string;
  description?: string;
  layout: TLayout;
  metadata: IMetadata;
  status: Pick<TStatus, 'isDraft' | 'isActive'>
}

export type TEnvironmentEdit = Pick<TEnvironment, 'name' | 'description' | 'layout' | 'status' | 'metadata'>

export type TWidgetContent = {
  type: 'Embedded' | 'External' | 'Internal' | 'Script';
  value: string;
  params?: { [key: string]: any }
}

export type TWidget = {
  _id?: string;
  name: string;
  description: string;
  thumbnail: string;
  dimensions: {
    width: number;
    height: number;
  };
  content: TWidgetContent;
  category: string;
  resource: string;
  metadata: IMetadata
}

export type TAbility = {
  action?: string;
  subject: string;
}

export interface CommonDataType {
  key: string;
  [key: string]: any
}

export interface ITableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

export type TPaginateProps = {
  current: number;
  pageSize: number;
  sort?: [string[] | string, "descend" | "ascend"];
}

export type TColumns<T extends object = object> = TableProps<T>['columns'];
export type TTablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

export type TSplitterLayout = 'horizontal' | 'vertical';
export type TSplitterItem = { uuid: string, size?: number | string };
export type TSplitter = { uuid?: string; items?: TSplitterItem[], layout?: TSplitterLayout };