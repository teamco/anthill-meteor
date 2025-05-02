import { TSplitter } from './antd.type';
import { IUser } from './user.type';

export interface IObjectId {
  _id?: string;
}

export interface ICommonDataType extends IObjectId {
  key: string;
  [key: string]: any;
}

export type TStatus = {
  isDraft: boolean;
  isActive: boolean;
  isPending: boolean;
  isOnHold: boolean;
};

export type TTimestamp = {
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IMetadata extends TTimestamp {
  createdBy: IUser['_id'];
  updatedBy: IUser['_id'];
}

export type TTemplate = [{ items: [TSplitter[]] }] | [];
