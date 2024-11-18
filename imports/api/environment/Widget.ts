import { TWidget, IMetadata } from "./types";
import CommonUtils from "/imports/utils/common.utils";

export default class Widget extends CommonUtils implements TWidget {
  name: string;
  description: string;
  thumbnail: string;
  dimensions: { width: number; height: number; };
  contentType: { value: "Embedded" | "External"; resource: string; };
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
    this.contentType = widget.contentType;
    this.category = widget.category;
    this.resource = widget.resource;
  }
}