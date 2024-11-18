import * as _ from 'underscore';
import { EmptyWidget } from '../widgets/empty.widget';
export type TStatus = {
  isDraft: boolean;
  isActive: boolean;
  isPending: boolean;
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
  version: number;
  metadata: IMetadata,
  widgets: TWidget[]
}

export type TEnvironment = {
  createLayout(user: IUser): TLayout;
  updateLayout(layout: TLayout): TLayout;
  _id?: string;
  name: string;
  type: string;
  layout: TLayout;
  metadata: IMetadata;
  status: TStatus
}

type TWidgetContent = {
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