import { IMetadata, IUser, TLayout, TTemplate, TWidget } from "/imports/config/types";
import CommonUtils from "/imports/utils/common.util";

/**
 * Represents a layout that manages a collection of widgets and their metadata.
 * Extends CommonUtils and implements TLayout interface.
 * 
 * @property {TTemplate} template - The template associated with the layout.
 * @property {number} version - The version number of the layout.
 * @property {TWidget[]} widgets - An array of widgets contained in the layout.
 * @property {IMetadata} metadata - Metadata information including creation and update details.
 * 
 * @constructor
 * @param {IUser} user - The user responsible for creating the layout.
 * 
 * @method create - Initializes the layout with a template, version, and user metadata.
 * @param {TTemplate} template - The template to initialize the layout with.
 * @param {number} version - The version number to set for the layout.
 * @param {IUser} [user] - The user responsible for the creation of the layout.
 * 
 * @method addWidget - Adds a widget to the layout.
 * @param {TWidget} widget - The widget to be added.
 * 
 * @method removeWidget - Removes a widget from the layout.
 * @param {TWidget} widget - The widget to be removed.
 */
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