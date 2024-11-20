import { IMetadata, IUser, TLayout, TTemplate, TWidget } from "/imports/config/types";
import CommonUtils from "../../utils/common.util";

export default class Layout extends CommonUtils implements TLayout {
  template: TTemplate = {};
  version: number = 1;
  widgets: TWidget[] = [];
  metadata: IMetadata = {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '',
    updatedBy: ''
  };

  constructor(user: IUser) {
    super();

    this.create({}, 1, user);
  }

  create(template: TTemplate, version: number, user?: IUser): void {
    this.template = template;
    this.version = version;
    this.widgets = [];
    this.metadata = {
      ...this.metadata,
      createdBy: user?._id,
      updatedBy: user?._id
    }
  }

  addWidget(widget: TWidget): void {
    this.widgets.push(widget);
  }

  removeWidget(widget: TWidget): void {
    this.widgets = this.widgets.filter((w) => w._id !== widget._id);
  }
}