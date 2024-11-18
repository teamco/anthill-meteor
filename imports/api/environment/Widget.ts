import { TWidget, IMetadata, TWidgetContent } from "/imports/config/types";
import CommonUtils from "/imports/utils/common.utils";

export default class Widget extends CommonUtils implements TWidget {
  _id?: string;
  name: string;
  description: string;
  thumbnail: string;
  dimensions: { width: number; height: number; };
  content: TWidgetContent;
  category: string;
  resource: string;
  metadata: IMetadata = {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '',
    updatedBy: ''
  };

  constructor(widget: TWidget) {
    super();

    this.create({...widget});
  }

  create(widget: TWidget): void {
    this.name = widget.name;
    this.description = widget.description;
    this.thumbnail = widget.thumbnail;
    this.dimensions = widget.dimensions;
    this.content = widget.content;
    this.category = widget.category;
    this.resource = widget.resource;
  }
}