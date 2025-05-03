import { IMetadata, TStatus } from './common.type';
import { TLayout } from './layout.type';
import { IUser } from './user.type';
import { TWidget } from './widget.type';

export type TEnvironment = {
  createLayout(user: IUser): TLayout;
  updateLayout(layout: TLayout): TLayout;
  assignedWidgets: TWidget[];
  _id?: string;
  name: string;
  description?: string;
  layout: TLayout;
  metadata: IMetadata;
  status: Pick<TStatus, 'isDraft' | 'isActive'>;
};

export type TEnvironmentEdit = Pick<
  TEnvironment,
  'name' | 'description' | 'layout' | 'status' | 'metadata'
>;
