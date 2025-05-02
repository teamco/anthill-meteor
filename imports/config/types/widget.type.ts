import { IMetadata } from './common.type';

export type TWidgetContent = {
  type: 'Embedded' | 'External' | 'Internal' | 'Script';
  value: string;
  params?: { [key: string]: any };
};

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
  metadata: IMetadata;
};