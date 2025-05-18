import { TSplitter } from './antd.type';
import { IUser } from './user.type';

export interface IObjectId {
  _id?: string;
}

export interface ICommonDataType extends IObjectId {
  key: string;
  [key: string]: unknown;
}

export type TStatus = {
  isDraft: boolean;
  isActive: boolean;
  isPending: boolean;
  isOnHold: boolean;
  isDeleted: boolean;
  isPublished: boolean;
  isExpired: boolean;
  isDisabled: boolean;
  isPublic: boolean;
};

export enum EStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PENDING = 'pending',
}

export type TTimestamp = {
  createdAt: Date;
  updatedAt?: Date;
};

export interface IMetadata extends TTimestamp {
  status?: EStatus;
  properties?: Partial<TStatus>;
  createdBy: IUser['_id'];
  updatedBy: IUser['_id'];
}

export type TTemplate = [{ items: [TSplitter[]] }] | [];

export enum ESort {
  ASC = 'ascend',
  DESC = 'descend',
}

export type ToRequired<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
    ? T[P]
    : T[P] | undefined;
};
