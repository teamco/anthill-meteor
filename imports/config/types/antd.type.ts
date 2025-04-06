import { SorterResult, TablePaginationConfig } from "antd/es/table/interface";
import { GetProp, TableProps } from "antd/lib";

export interface ITableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

export type TPaginateProps = {
  current: number;
  pageSize: number;
  sort?: [string[] | string, "descend" | "ascend"];
};

export type TColumns<T extends object = object> = TableProps<T>["columns"];
export type TTablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

export type TSplitterLayout = "horizontal" | "vertical";
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
};
