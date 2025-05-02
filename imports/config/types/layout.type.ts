import { IMetadata, TTemplate } from "./common.type";
import { TWidget } from "./widget.type";

export type TLayout = {
  addWidget(widget: TWidget): void;
  removeWidget(widget: TWidget): void;
  template: TTemplate;
  current: boolean;
  version: number;
  metadata: IMetadata;
  widgets: TLayoutWidget;
};

export type TWidgetWithId = Required<Pick<TWidget, "_id">> & TWidget;

export type TLayoutWidget = {
  [key: string]: TWidgetWithId
} | {};