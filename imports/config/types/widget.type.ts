import { IMetadata } from './common.type';

export type TWidgetContent = {
  type: 'Embedded' | 'External' | 'Internal' | 'Script';
  value: string;
  params?: { [key: string]: any };
};

export type TWidgetConfig = {
  isDraggable: boolean;
  isResizable: boolean;
  isRemovable: boolean;
  isEditable: boolean;
  isMovable: boolean;
  isClonable: boolean;
};

export type TWidgetTags = string[];

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
  config: TWidgetConfig;
  metadata: IMetadata;
  tags: TWidgetTags;
};
